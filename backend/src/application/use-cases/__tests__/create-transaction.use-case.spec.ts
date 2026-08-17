import { CreateTransactionUseCase } from '../create-transaction.use-case';
import { Product } from '../../../domain/entities/product.entity';
import { Customer } from '../../../domain/entities/customer.entity';
import { Delivery } from '../../../domain/entities/delivery.entity';
import { Transaction } from '../../../domain/entities/transaction.entity';
import { Result } from '../../../shared/result';

describe('CreateTransactionUseCase', () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const customerId = '123e4567-e89b-12d3-a456-426614174001';
    const deliveryId = '123e4567-e89b-12d3-a456-426614174003';

    const mockProduct = Product.create({
        id: productId,
        name: 'Auriculares Pro',
        description: 'Test',
        priceInCents: 15990000,
        stock: 10,
    }).getValue();

    const mockCustomer = Customer.create({
        id: customerId,
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
    }).getValue();

    const mockDelivery = Delivery.create({
        id: deliveryId,
        customerId,
        address: 'Calle 123',
        city: 'Bogotá',
    }).getValue();

    const mockTransaction = Transaction.create({
        id: '123e4567-e89b-12d3-a456-426614174002',
        reference: 'txn_test',
        productId,
        customerId,
        deliveryId,
        amountInCents: 15990000,
        baseFeeInCents: 500000,
        deliveryFeeInCents: 800000,
    }).getValue();

    const mockProductRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
        save: jest.fn(),
        updateStock: jest.fn(),
    };
    const mockCustomerRepository = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        save: jest.fn(),
    };
    const mockDeliveryRepository = {
        findById: jest.fn(),
        save: jest.fn(),
    };
    const mockTransactionRepository = {
        findById: jest.fn(),
        findByReference: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
    };

    let useCase: CreateTransactionUseCase;

    const input = {
        productId,
        customer: { fullName: 'Juan Pérez', email: 'juan@example.com' },
        delivery: { address: 'Calle 123', city: 'Bogotá' },
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new CreateTransactionUseCase(
            mockProductRepository as any,
            mockCustomerRepository as any,
            mockDeliveryRepository as any,
            mockTransactionRepository as any,
        );
    });

    it('creates transaction successfully', async () => {
        mockProductRepository.findById.mockResolvedValue(Result.ok(mockProduct));
        mockCustomerRepository.findByEmail.mockResolvedValue(Result.ok(null));
        mockCustomerRepository.save.mockResolvedValue(Result.ok(mockCustomer));
        mockDeliveryRepository.save.mockResolvedValue(Result.ok(mockDelivery));
        mockTransactionRepository.save.mockResolvedValue(Result.ok(mockTransaction));

        const result = await useCase.execute(input);
        expect(result.isSuccess()).toBe(true);
    });

    it('fails when out of stock', async () => {
        const noStock = Product.create({
            id: productId,
            name: 'Auriculares Pro',
            description: 'Test',
            priceInCents: 15990000,
            stock: 0,
        }).getValue();
        mockProductRepository.findById.mockResolvedValue(Result.ok(noStock));

        const result = await useCase.execute(input);
        expect(result.isFailure()).toBe(true);
    });

    it('fails when product not found', async () => {
        mockProductRepository.findById.mockResolvedValue(
            Result.fail(new Error('Product not found')),
        );
        const result = await useCase.execute(input);
        expect(result.isFailure()).toBe(true);
    });

    it('reuses existing customer', async () => {
        mockProductRepository.findById.mockResolvedValue(Result.ok(mockProduct));
        mockCustomerRepository.findByEmail.mockResolvedValue(Result.ok(mockCustomer));
        mockDeliveryRepository.save.mockResolvedValue(Result.ok(mockDelivery));
        mockTransactionRepository.save.mockResolvedValue(Result.ok(mockTransaction));

        const result = await useCase.execute(input);
        expect(result.isSuccess()).toBe(true);
        expect(mockCustomerRepository.save).not.toHaveBeenCalled();
    });
});