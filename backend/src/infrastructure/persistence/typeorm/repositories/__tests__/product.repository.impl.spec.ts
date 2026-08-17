import { ProductRepositoryImpl } from '../product.repository.impl';
import { Product } from '../../../../../domain/entities/product.entity';
import { Result } from '../../../../../shared/result';

describe('ProductRepositoryImpl', () => {
    const mockRepo = {
        findOne: jest.fn(),
        find: jest.fn(),
        save: jest.fn(),
    };

    let repository: ProductRepositoryImpl;

    const domainProduct = Product.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test Product',
        description: 'Desc',
        priceInCents: 10000,
        stock: 5,
    }).getValue();

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new ProductRepositoryImpl(mockRepo as any);
    });

    it('findById returns product when found', async () => {
        mockRepo.findOne.mockResolvedValue({
            id: domainProduct.id,
            name: domainProduct.name,
            description: domainProduct.description,
            priceInCents: 10000,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await repository.findById(domainProduct.id);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().name).toBe('Test Product');
    });

    it('findById fails when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findById('missing');
        expect(result.isFailure()).toBe(true);
    });

    it('findAll returns products', async () => {
        mockRepo.find.mockResolvedValue([
            {
                id: domainProduct.id,
                name: domainProduct.name,
                description: domainProduct.description,
                priceInCents: 10000,
                stock: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);

        const result = await repository.findAll();
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toHaveLength(1);
    });

    it('save persists product', async () => {
        mockRepo.save.mockResolvedValue({
            id: domainProduct.id,
            name: domainProduct.name,
            description: domainProduct.description,
            priceInCents: 10000,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await repository.save(domainProduct);
        expect(result.isSuccess()).toBe(true);
    });

    it('updateStock updates stock', async () => {
        mockRepo.findOne.mockResolvedValue({
            id: domainProduct.id,
            name: domainProduct.name,
            description: domainProduct.description,
            priceInCents: 10000,
            stock: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        mockRepo.save.mockImplementation(async (orm) => orm);

        const result = await repository.updateStock(domainProduct.id, 3);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().stock).toBe(3);
    });
});