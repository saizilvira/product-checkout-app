import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { Result } from '../../../../shared/result';

export class TransactionMapper {
    static toDomain(orm: TransactionOrmEntity): Result<Transaction> {
        return Transaction.create({
            id: orm.id,
            reference: orm.reference,
            paymentGatewayTransactionId: orm.paymentGatewayTransactionId,
            productId: orm.productId,
            customerId: orm.customerId,
            deliveryId: orm.deliveryId,
            amountInCents: orm.amountInCents,
            baseFeeInCents: orm.baseFeeInCents,
            deliveryFeeInCents: orm.deliveryFeeInCents,
            paymentMethodType: orm.paymentMethodType,
            cardBrand: orm.cardBrand,
            cardLastFour: orm.cardLastFour,
            currency: orm.currency,
            status: orm.status,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: Transaction): TransactionOrmEntity {
        const orm = new TransactionOrmEntity();
        orm.id = domain.id;
        orm.reference = domain.reference;
        orm.paymentGatewayTransactionId = domain.paymentGatewayTransactionId;
        orm.productId = domain.productId;
        orm.customerId = domain.customerId;
        orm.deliveryId = domain.deliveryId;
        orm.amountInCents = domain.amount.amountInCents;
        orm.baseFeeInCents = domain.baseFee.amountInCents;
        orm.deliveryFeeInCents = domain.deliveryFee.amountInCents;
        orm.totalInCents = domain.total.amountInCents;
        orm.status = domain.status.value;
        orm.paymentMethodType = domain.paymentMethodType;
        orm.cardBrand = domain.cardBrand;
        orm.cardLastFour = domain.cardLastFour;
        orm.currency = domain.currency;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}