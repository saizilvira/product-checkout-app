import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    ParseUUIDPipe,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from '../../../application/use-cases/process-payment.use-case';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ProcessPaymentDto } from '../dto/process-payment.dto';
import {
    TRANSACTION_REPOSITORY,
    TransactionRepository,
} from '../../../domain/repositories/transaction.repository';
import { Inject } from '@nestjs/common';

@Controller('transactions')
export class TransactionController {
    constructor(
        private readonly createTransactionUseCase: CreateTransactionUseCase,
        private readonly processPaymentUseCase: ProcessPaymentUseCase,
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepository,
    ) { }

    @Post()
    async createTransaction(@Body() dto: CreateTransactionDto) {
        const result = await this.createTransactionUseCase.execute({
            productId: dto.productId,
            customer: dto.customer,
            delivery: dto.delivery,
            cardBrand: dto.cardBrand,
            cardLastFour: dto.cardLastFour,
        });

        if (result.isFailure()) {
            throw new HttpException(
                result.getError().message,
                HttpStatus.BAD_REQUEST,
            );
        }

        const transaction = result.getValue();

        return {
            id: transaction.id,
            reference: transaction.reference,
            status: transaction.status.value,
            amountInCents: transaction.amount.amountInCents,
            baseFeeInCents: transaction.baseFee.amountInCents,
            deliveryFeeInCents: transaction.deliveryFee.amountInCents,
            totalInCents: transaction.total.amountInCents,
            currency: transaction.currency,
        };
    }

    @Post('process-payment')
    async processPayment(@Body() dto: ProcessPaymentDto) {
        const result = await this.processPaymentUseCase.execute({
            transactionId: dto.transactionId,
            paymentSourceId: dto.paymentSourceId,
            customerEmail: dto.customerEmail,
        });

        if (result.isFailure()) {
            throw new HttpException(
                result.getError().message,
                HttpStatus.BAD_REQUEST,
            );
        }

        const transaction = result.getValue();

        return {
            id: transaction.id,
            reference: transaction.reference,
            status: transaction.status.value,
            paymentGatewayTransactionId: transaction.paymentGatewayTransactionId,
            totalInCents: transaction.total.amountInCents,
            currency: transaction.currency,
        };
    }

    @Get(':id')
    async getTransaction(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.transactionRepository.findById(id);

        if (result.isFailure()) {
            throw new HttpException(result.getError().message, HttpStatus.NOT_FOUND);
        }

        const transaction = result.getValue();

        return {
            id: transaction.id,
            reference: transaction.reference,
            status: transaction.status.value,
            paymentGatewayTransactionId: transaction.paymentGatewayTransactionId,
            amountInCents: transaction.amount.amountInCents,
            baseFeeInCents: transaction.baseFee.amountInCents,
            deliveryFeeInCents: transaction.deliveryFee.amountInCents,
            totalInCents: transaction.total.amountInCents,
            currency: transaction.currency,
            cardBrand: transaction.cardBrand,
            cardLastFour: transaction.cardLastFour,
            createdAt: transaction.createdAt,
        };
    }
}