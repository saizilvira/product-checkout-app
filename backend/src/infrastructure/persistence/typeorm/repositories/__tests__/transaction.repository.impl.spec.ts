import { TransactionRepositoryImpl } from '../transaction.repository.impl';
import { Transaction } from '../../../../../domain/entities/transaction.entity';

describe('TransactionRepositoryImpl', () => {
    const mockRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    let repository: TransactionRepositoryImpl;

    const domainTransaction = Transaction.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        reference: 'txn_123',
        productId: '123e4567-e89b-12d3-a456-426614174001',
        customerId: '123e4567-e89b-12d3-a456-426614174002',
        deliveryId: '123e4567-e89b-12d3-a456-426614174003',
        amountInCents: 10000,
        baseFeeInCents: 1000,
        deliveryFeeInCents: 500,
    }).getValue();

    const ormTransaction = {
        id: domainTransaction.id,
        reference: domainTransaction.reference,
        paymentGatewayTransactionId: domainTransaction.paymentGatewayTransactionId,
        productId: domainTransaction.productId,
        customerId: domainTransaction.customerId,
        deliveryId: domainTransaction.deliveryId,
        amountInCents: domainTransaction.amount.amountInCents,
        baseFeeInCents: domainTransaction.baseFee.amountInCents,
        deliveryFeeInCents: domainTransaction.deliveryFee.amountInCents,
        totalInCents: domainTransaction.total.amountInCents,
        status: domainTransaction.status.value,
        paymentMethodType: domainTransaction.paymentMethodType,
        cardBrand: domainTransaction.cardBrand,
        cardLastFour: domainTransaction.cardLastFour,
        currency: domainTransaction.currency,
        createdAt: new Date(),
        updatedAt: new Date(),
        product: { id: domainTransaction.productId },
        customer: { id: domainTransaction.customerId },
        delivery: { id: domainTransaction.deliveryId }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new TransactionRepositoryImpl(mockRepo as any);
    });

    it('findById returns transaction when found', async () => {
        mockRepo.findOne.mockResolvedValue(ormTransaction);

        const result = await repository.findById(domainTransaction.id);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().reference).toBe('txn_123');
    });

    it('findById fails when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findById('missing');
        expect(result.isFailure()).toBe(true);
    });

    it('findByReference returns transaction when found', async () => {
        mockRepo.findOne.mockResolvedValue(ormTransaction);

        const result = await repository.findByReference(domainTransaction.reference);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().reference).toBe('txn_123');
    });

    it('findByReference fails when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findByReference('missing');
        expect(result.isFailure()).toBe(true);
    });

    it('save persists transaction', async () => {
        mockRepo.save.mockResolvedValue(ormTransaction);

        const result = await repository.save(domainTransaction);
        expect(result.isSuccess()).toBe(true);
    });

    it('update persists transaction', async () => {
        mockRepo.save.mockResolvedValue(ormTransaction);

        const result = await repository.update(domainTransaction);
        expect(result.isSuccess()).toBe(true);
    });
});
