import { ProcessPaymentUseCase } from '../process-payment.use-case';
import { Product } from '../../../domain/entities/product.entity';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Result } from '../../../shared/result';

describe('ProcessPaymentUseCase', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const transactionId = '123e4567-e89b-12d3-a456-426614174002';

    const mockProduct = Product.create({
        id: productId,
        name: 'Auriculares Pro',
        description: 'Test',
        priceInCents: 15990000,
        stock: 10,
    }).getValue();

    const mockTransaction = Transaction.create({
        id: transactionId,
        reference: 'txn_test',
        productId,
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        deliveryId: '123e4567-e89b-12d3-a456-426614174003',
        amountInCents: 15990000,
        baseFeeInCents: 500000,
        deliveryFeeInCents: 800000,
    }).getValue();

    const mockTransactionRepository = {
        findById: jest.fn(),
        findByReference: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
    };

    const mockProductRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
        save: jest.fn(),
        updateStock: jest.fn(),
    };

    const mockPaymentGateway = {
        createPayment: jest.fn(),
    };

    let useCase: ProcessPaymentUseCase;

    const input = {
        transactionId,
        paymentSourceId: 'tok_test_123',
        customerEmail: 'juan@example.com',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new ProcessPaymentUseCase(
            mockTransactionRepository as any,
            mockProductRepository as any,
            mockPaymentGateway as any,
        );
    });

    it('should process an approved payment and decrease stock', async () => {
        mockTransactionRepository.findById.mockResolvedValue(Result.ok(mockTransaction));
        mockPaymentGateway.createPayment.mockResolvedValue(
            Result.ok({
                transactionId: 'gw_123',
                status: 'APPROVED',
            }),
        );
        mockTransactionRepository.update.mockImplementation(async (tx) => Result.ok(tx));
        mockProductRepository.findById.mockResolvedValue(Result.ok(mockProduct));
        mockProductRepository.save.mockImplementation(async (p) => Result.ok(p));

        const result = await useCase.execute(input);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status.value).toBe('APPROVED');
        expect(mockProductRepository.save).toHaveBeenCalled();
    });

    it('should process a declined payment without decreasing stock', async () => {
        mockTransactionRepository.findById.mockResolvedValue(Result.ok(mockTransaction));
        mockPaymentGateway.createPayment.mockResolvedValue(
            Result.ok({
                transactionId: 'gw_456',
                status: 'DECLINED',
            }),
        );
        mockTransactionRepository.update.mockImplementation(async (tx) => Result.ok(tx));

        const result = await useCase.execute(input);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status.value).toBe('DECLINED');
        expect(mockProductRepository.save).not.toHaveBeenCalled();
    });

    it('should fail when transaction is not pending', async () => {
        const approvedTx = mockTransaction.markAsApproved('gw_999').getValue();
        mockTransactionRepository.findById.mockResolvedValue(Result.ok(approvedTx));

        const result = await useCase.execute(input);

        expect(result.isFailure()).toBe(true);
    });

    it('should fail when transaction is not found', async () => {
        mockTransactionRepository.findById.mockResolvedValue(
            Result.fail(new Error('Transaction not found')),
        );

        const result = await useCase.execute(input);

        expect(result.isFailure()).toBe(true);
    });
});