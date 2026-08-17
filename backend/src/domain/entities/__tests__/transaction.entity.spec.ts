import { Transaction } from '../transaction.entity';

describe('Transaction Entity', () => {
    const validProps = {
        id: '123e4567-e89b-12d3-a456-426614174002',
        reference: 'txn_123456',
        productId: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        deliveryId: '123e4567-e89b-12d3-a456-426614174003',
        amountInCents: 15990000,
        baseFeeInCents: 500000,
        deliveryFeeInCents: 800000,
    };

    it('should create a transaction in PENDING status', () => {
        const result = Transaction.create(validProps);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status.isPending()).toBe(true);
        expect(result.getValue().total.amountInCents).toBe(17290000);
    });

    it('should fail without reference', () => {
        const result = Transaction.create({ ...validProps, reference: '' });
        expect(result.isFailure()).toBe(true);
    });

    it('should mark as approved', () => {
        const transaction = Transaction.create(validProps).getValue();
        const result = transaction.markAsApproved('gw_txn_999');

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status.value).toBe('APPROVED');
        expect(result.getValue().paymentGatewayTransactionId).toBe('gw_txn_999');
    });

    it('should mark as declined', () => {
        const transaction = Transaction.create(validProps).getValue();
        const result = transaction.markAsDeclined('gw_txn_888');

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status.value).toBe('DECLINED');
    });

    it('should not allow updating a final status transaction', () => {
        const transaction = Transaction.create(validProps).getValue();
        const approved = transaction.markAsApproved('gw_txn_999').getValue();
        const result = approved.markAsDeclined();

        expect(result.isFailure()).toBe(true);
    });
});