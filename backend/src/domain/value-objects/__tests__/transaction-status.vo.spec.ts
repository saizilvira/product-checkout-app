import { TransactionStatus, TransactionStatusEnum } from '../transaction-status.vo';

describe('TransactionStatus Value Object', () => {
    it('should create a valid status', () => {
        const result = TransactionStatus.create('PENDING');
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().value).toBe(TransactionStatusEnum.PENDING);
    });

    it('should fail with invalid status', () => {
        const result = TransactionStatus.create('INVALID');
        expect(result.isFailure()).toBe(true);
    });

    it('should create pending status using factory', () => {
        const status = TransactionStatus.pending();
        expect(status.isPending()).toBe(true);
        expect(status.isFinal()).toBe(false);
    });

    it('should identify final statuses', () => {
        const approved = TransactionStatus.create('APPROVED').getValue();
        const declined = TransactionStatus.create('DECLINED').getValue();
        const error = TransactionStatus.create('ERROR').getValue();

        expect(approved.isFinal()).toBe(true);
        expect(declined.isFinal()).toBe(true);
        expect(error.isFinal()).toBe(true);
    });
});