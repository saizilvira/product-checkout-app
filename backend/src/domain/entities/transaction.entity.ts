import { Result } from '../../shared/result';
import { Money } from '../value-objects/money.vo';
import { TransactionStatus } from '../value-objects/transaction-status.vo';

interface TransactionProps {
    id: string;
    reference: string;
    paymentGatewayTransactionId?: string;
    productId: string;
    customerId: string;
    deliveryId: string;
    amount: Money;           // precio del producto
    baseFee: Money;          // fee fijo
    deliveryFee: Money;
    total: Money;
    status: TransactionStatus;
    paymentMethodType?: string;
    cardBrand?: string;
    cardLastFour?: string;
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Transaction {
    private constructor(private readonly props: TransactionProps) { }

    static create(props: {
        id: string;
        reference: string;
        productId: string;
        customerId: string;
        deliveryId: string;
        amountInCents: number;
        baseFeeInCents: number;
        deliveryFeeInCents: number;
        paymentMethodType?: string;
        cardBrand?: string;
        cardLastFour?: string;
        currency?: string;
        paymentGatewayTransactionId?: string;
        status?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Result<Transaction> {
        if (!props.reference || props.reference.trim().length === 0) {
            return Result.fail(new Error('Transaction reference is required'));
        }

        const amountResult = Money.create(props.amountInCents);
        if (amountResult.isFailure()) return Result.fail(amountResult.getError());

        const baseFeeResult = Money.create(props.baseFeeInCents);
        if (baseFeeResult.isFailure()) return Result.fail(baseFeeResult.getError());

        const deliveryFeeResult = Money.create(props.deliveryFeeInCents);
        if (deliveryFeeResult.isFailure()) return Result.fail(deliveryFeeResult.getError());

        const totalResult = amountResult
            .getValue()
            .add(baseFeeResult.getValue())
            .flatMap((partial) => partial.add(deliveryFeeResult.getValue()));

        if (totalResult.isFailure()) return Result.fail(totalResult.getError());

        const statusResult = props.status
            ? TransactionStatus.create(props.status)
            : Result.ok(TransactionStatus.pending());

        if (statusResult.isFailure()) return Result.fail(statusResult.getError());

        const now = new Date();

        return Result.ok(
            new Transaction({
                id: props.id,
                reference: props.reference.trim(),
                paymentGatewayTransactionId: props.paymentGatewayTransactionId,
                productId: props.productId,
                customerId: props.customerId,
                deliveryId: props.deliveryId,
                amount: amountResult.getValue(),
                baseFee: baseFeeResult.getValue(),
                deliveryFee: deliveryFeeResult.getValue(),
                total: totalResult.getValue(),
                status: statusResult.getValue(),
                paymentMethodType: props.paymentMethodType,
                cardBrand: props.cardBrand,
                cardLastFour: props.cardLastFour,
                currency: props.currency || 'COP',
                createdAt: props.createdAt || now,
                updatedAt: props.updatedAt || now,
            }),
        );
    }

    // Getters
    get id(): string { return this.props.id; }
    get reference(): string { return this.props.reference; }
    get paymentGatewayTransactionId(): string | undefined { return this.props.paymentGatewayTransactionId; }
    get productId(): string { return this.props.productId; }
    get customerId(): string { return this.props.customerId; }
    get deliveryId(): string { return this.props.deliveryId; }
    get amount(): Money { return this.props.amount; }
    get baseFee(): Money { return this.props.baseFee; }
    get deliveryFee(): Money { return this.props.deliveryFee; }
    get total(): Money { return this.props.total; }
    get status(): TransactionStatus { return this.props.status; }
    get paymentMethodType(): string | undefined { return this.props.paymentMethodType; }
    get cardBrand(): string | undefined { return this.props.cardBrand; }
    get cardLastFour(): string | undefined { return this.props.cardLastFour; }
    get currency(): string { return this.props.currency; }
    get createdAt(): Date { return this.props.createdAt; }
    get updatedAt(): Date { return this.props.updatedAt; }

    markAsApproved(paymentGatewayTransactionId: string): Result<Transaction> {
        return this.updateStatus('APPROVED', paymentGatewayTransactionId);
    }

    markAsDeclined(paymentGatewayTransactionId?: string): Result<Transaction> {
        return this.updateStatus('DECLINED', paymentGatewayTransactionId);
    }

    markAsError(paymentGatewayTransactionId?: string): Result<Transaction> {
        return this.updateStatus('ERROR', paymentGatewayTransactionId);
    }

    private updateStatus(
        status: string,
        paymentGatewayTransactionId?: string,
    ): Result<Transaction> {
        if (this.props.status.isFinal()) {
            return Result.fail(new Error('Cannot update a transaction with final status'));
        }

        return Transaction.create({
            id: this.props.id,
            reference: this.props.reference,
            productId: this.props.productId,
            customerId: this.props.customerId,
            deliveryId: this.props.deliveryId,
            amountInCents: this.props.amount.amountInCents,
            baseFeeInCents: this.props.baseFee.amountInCents,
            deliveryFeeInCents: this.props.deliveryFee.amountInCents,
            paymentMethodType: this.props.paymentMethodType,
            cardBrand: this.props.cardBrand,
            cardLastFour: this.props.cardLastFour,
            currency: this.props.currency,
            paymentGatewayTransactionId: paymentGatewayTransactionId || this.props.paymentGatewayTransactionId,
            status,
            createdAt: this.props.createdAt,
            updatedAt: new Date(),
        });
    }
}