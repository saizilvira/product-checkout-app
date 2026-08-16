import { Inject, Injectable } from '@nestjs/common';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';
import { PAYMENT_GATEWAY } from '../../domain/repositories/payment-gateway.port';
import type { PaymentGatewayPort } from '../../domain/repositories/payment-gateway.port';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Result } from '../../shared/result';

export interface ProcessPaymentInput {
    transactionId: string;
    paymentSourceId: string;
    customerEmail: string;
}

@Injectable()
export class ProcessPaymentUseCase {
    constructor(
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepository,
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository,
        @Inject(PAYMENT_GATEWAY)
        private readonly paymentGateway: PaymentGatewayPort,
    ) { }

    async execute(input: ProcessPaymentInput): Promise<Result<Transaction>> {
        // 1. Obtener transacción
        const transactionResult = await this.transactionRepository.findById(
            input.transactionId,
        );
        if (transactionResult.isFailure()) {
            return Result.fail(transactionResult.getError());
        }

        let transaction = transactionResult.getValue();

        if (!transaction.status.isPending()) {
            return Result.fail(new Error('Transaction is not in PENDING status'));
        }

        // 2. Llamar al payment gateway
        const paymentResult = await this.paymentGateway.createPayment({
            reference: transaction.reference,
            amountInCents: transaction.total.amountInCents,
            currency: transaction.currency,
            customerEmail: input.customerEmail,
            paymentSourceId: input.paymentSourceId,
        });

        if (paymentResult.isFailure()) {
            const errorUpdate = transaction.markAsError();
            if (errorUpdate.isSuccess()) {
                await this.transactionRepository.update(errorUpdate.getValue());
            }
            return Result.fail(paymentResult.getError());
        }

        const payment = paymentResult.getValue();

        // 3. Actualizar estado según respuesta
        let updatedTransactionResult: Result<Transaction>;

        switch (payment.status) {
            case 'APPROVED':
                updatedTransactionResult = transaction.markAsApproved(payment.transactionId);
                break;
            case 'DECLINED':
                updatedTransactionResult = transaction.markAsDeclined(payment.transactionId);
                break;
            default:
                updatedTransactionResult = transaction.markAsError(payment.transactionId);
        }

        if (updatedTransactionResult.isFailure()) {
            return Result.fail(updatedTransactionResult.getError());
        }

        const saveResult = await this.transactionRepository.update(
            updatedTransactionResult.getValue(),
        );
        if (saveResult.isFailure()) {
            return Result.fail(saveResult.getError());
        }

        transaction = saveResult.getValue();

        // 4. Si fue aprobada → descontar stock
        if (transaction.status.value === 'APPROVED') {
            const productResult = await this.productRepository.findById(
                transaction.productId,
            );
            if (productResult.isSuccess()) {
                const product = productResult.getValue();
                const decreasedResult = product.decreaseStock(1);

                if (decreasedResult.isSuccess()) {
                    await this.productRepository.save(decreasedResult.getValue());
                }
            }
        }

        return Result.ok(transaction);
    }
}