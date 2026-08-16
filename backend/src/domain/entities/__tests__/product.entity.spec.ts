import { Product } from '../product.entity';

describe('Product Entity', () => {
    const validProps = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Auriculares Pro',
        description: 'Descripción de prueba',
        priceInCents: 15990000,
        stock: 10,
    };

    it('should create a valid product', () => {
        const result = Product.create(validProps);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().name).toBe('Auriculares Pro');
        expect(result.getValue().stock).toBe(10);
    });

    it('should fail without name', () => {
        const result = Product.create({ ...validProps, name: '' });
        expect(result.isFailure()).toBe(true);
    });

    it('should fail with negative stock', () => {
        const result = Product.create({ ...validProps, stock: -1 });
        expect(result.isFailure()).toBe(true);
    });

    it('should detect available stock', () => {
        const product = Product.create(validProps).getValue();
        expect(product.hasStock(1)).toBe(true);
        expect(product.hasStock(10)).toBe(true);
        expect(product.hasStock(11)).toBe(false);
    });

    it('should decrease stock successfully', () => {
        const product = Product.create(validProps).getValue();
        const result = product.decreaseStock(2);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().stock).toBe(8);
    });

    it('should fail when decreasing more stock than available', () => {
        const product = Product.create(validProps).getValue();
        const result = product.decreaseStock(15);

        expect(result.isFailure()).toBe(true);
    });
});