import { GetProductUseCase } from '../get-product.use-case';
import { Product } from '../../../domain/entities/product.entity';
import { Result } from '../../../shared/result';

describe('GetProductUseCase', () => {
    const mockProduct = Product.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Auriculares Pro',
        description: 'Test product',
        priceInCents: 15990000,
        stock: 10,
    }).getValue();

    const mockProductRepository = {
        findById: jest.fn(),
        findAll: jest.fn(),
        save: jest.fn(),
        updateStock: jest.fn(),
    };

    let useCase: GetProductUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        useCase = new GetProductUseCase(mockProductRepository as any);
    });

    it('should return product by id', async () => {
        mockProductRepository.findById.mockResolvedValue(Result.ok(mockProduct));

        const result = await useCase.execute(mockProduct.id);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().id).toBe(mockProduct.id);
        expect(mockProductRepository.findById).toHaveBeenCalledWith(mockProduct.id);
    });

    it('should return first product when no id is provided', async () => {
        mockProductRepository.findAll.mockResolvedValue(Result.ok([mockProduct]));

        const result = await useCase.execute();

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().name).toBe('Auriculares Pro');
    });

    it('should fail when no products exist', async () => {
        mockProductRepository.findAll.mockResolvedValue(Result.ok([]));

        const result = await useCase.execute();

        expect(result.isFailure()).toBe(true);
    });

    it('should fail when product is not found', async () => {
        mockProductRepository.findById.mockResolvedValue(
            Result.fail(new Error('Product not found')),
        );

        const result = await useCase.execute('non-existent-id');

        expect(result.isFailure()).toBe(true);
    });
});