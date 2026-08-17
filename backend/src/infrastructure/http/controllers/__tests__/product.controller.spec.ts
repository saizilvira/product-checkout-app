import { ProductController } from '../product.controller';
import { GetProductUseCase } from '../../../../application/use-cases/get-product.use-case';
import { Product } from '../../../../domain/entities/product.entity';
import { Result } from '../../../../shared/result';
import { HttpException } from '@nestjs/common';

describe('ProductController', () => {
    const mockUseCase = {
        execute: jest.fn(),
    };

    let controller: ProductController;

    const product = Product.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test',
        description: 'Desc',
        priceInCents: 10000,
        stock: 5,
    }).getValue();

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new ProductController(mockUseCase as unknown as GetProductUseCase);
    });

    it('getProduct returns product data', async () => {
        mockUseCase.execute.mockResolvedValue(Result.ok(product));
        const result = await controller.getProduct();
        expect(result.id).toBe(product.id);
        expect(result.priceInCents).toBe(10000);
    });

    it('getProduct throws when not found', async () => {
        mockUseCase.execute.mockResolvedValue(Result.fail(new Error('Not found')));
        await expect(controller.getProduct()).rejects.toThrow(HttpException);
    });

    it('getProductById returns product', async () => {
        mockUseCase.execute.mockResolvedValue(Result.ok(product));
        const result = await controller.getProductById(product.id);
        expect(result.name).toBe('Test');
    });
});