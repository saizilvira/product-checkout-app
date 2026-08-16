import { Customer } from '../customer.entity';

describe('Customer Entity', () => {
    const validProps = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
    };

    it('should create a valid customer', () => {
        const result = Customer.create(validProps);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().email).toBe('juan@example.com');
    });

    it('should fail without fullName', () => {
        const result = Customer.create({ ...validProps, fullName: '' });
        expect(result.isFailure()).toBe(true);
    });

    it('should fail with invalid email', () => {
        const result = Customer.create({ ...validProps, email: 'invalid-email' });
        expect(result.isFailure()).toBe(true);
    });

    it('should normalize email to lowercase', () => {
        const result = Customer.create({
            ...validProps,
            email: 'Juan.Perez@Example.COM',
        });
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().email).toBe('juan.perez@example.com');
    });
});