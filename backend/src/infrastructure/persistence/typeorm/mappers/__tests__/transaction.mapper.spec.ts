import { TransactionMapper } from '../transaction.mapper';
import { Transaction } from '../../../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../../entities/transaction.orm-entity';

describe('TransactionMapper', () => {
    const domainTransaction = Transaction.create({
        id: '123e4567-e89b-12d3-a456-426614174002',
        reference: 'txn_test_001',
        productId: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        deliveryId: '123e4567-e89b-12d3-a456-426614174003',
        amountInCents: 15990000,
        baseFeeInCents: 500000,
        deliveryFeeInCents: 800000,
        cardBrand: 'VISA',
        cardLastFour: '4242',
    }).getValue();

    it('should map domain to orm', () => {
        const orm = TransactionMapper.toOrm(domainTransaction);
        expect(orm.reference).toBe('txn_test_001');
        expect(orm.totalInCents).toBe(17290000);
        expect(orm.status).toBe('PENDING');
    });

    it('should map orm to domain', () => {
        const orm = new TransactionOrmEntity();
        orm.id = domainTransaction.id;
        orm.reference = domainTransaction.reference;
        orm.productId = domainTransaction.productId;
        orm.customerId = domainTransaction.customerId;
        orm.deliveryId = domainTransaction.deliveryId;
        orm.amountInCents = 15990000;
        orm.baseFeeInCents = 500000;
        orm.deliveryFeeInCents = 800000;
        orm.totalInCents = 17290000;
        orm.status = 'PENDING';
        orm.currency = 'COP';
        orm.createdAt = new Date();
        orm.updatedAt = new Date();

        const result = TransactionMapper.toDomain(orm);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().total.amountInCents).toBe(17290000);
    });
});