import { ProductMapper } from '../product.mapper';
import { Product } from '../../../../../domain/entities/product.entity';
import { ProductOrmEntity } from '../../entities/product.orm-entity';

describe('ProductMapper', () => {
    const domainProduct = Product.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Auriculares Pro',
        description: 'Test',
        priceInCents: 15990000,
        stock: 10,
        imageUrl: 'https://example.com/img.jpg',
    }).getValue();

    it('should map domain to orm', () => {
        const orm = ProductMapper.toOrm(domainProduct);

        expect(orm.id).toBe(domainProduct.id);
        expect(orm.name).toBe(domainProduct.name);
        expect(orm.priceInCents).toBe(15990000);
        expect(orm.stock).toBe(10);
    });

    it('should map orm to domain', () => {
        const orm = new ProductOrmEntity();
        orm.id = domainProduct.id;
        orm.name = domainProduct.name;
        orm.description = domainProduct.description;
        orm.priceInCents = 15990000;
        orm.stock = 10;
        orm.imageUrl = 'https://example.com/img.jpg';
        orm.createdAt = new Date();
        orm.updatedAt = new Date();

        const result = ProductMapper.toDomain(orm);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().id).toBe(domainProduct.id);
        expect(result.getValue().price.amountInCents).toBe(15990000);
    });
});