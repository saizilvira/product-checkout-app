import { Delivery } from '../delivery.entity';

describe('Delivery Entity', () => {
    const validProps = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        address: 'Calle 123 #45-67',
        city: 'Bogotá',
    };

    it('should create a valid delivery', () => {
        const result = Delivery.create(validProps);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().city).toBe('Bogotá');
    });

    it('should fail without address', () => {
        const result = Delivery.create({ ...validProps, address: '' });
        expect(result.isFailure()).toBe(true);
    });

    it('should fail without city', () => {
        const result = Delivery.create({ ...validProps, city: '' });
        expect(result.isFailure()).toBe(true);
    });

    it('should fail without customerId', () => {
        const result = Delivery.create({ ...validProps, customerId: '' });
        expect(result.isFailure()).toBe(true);
    });
});