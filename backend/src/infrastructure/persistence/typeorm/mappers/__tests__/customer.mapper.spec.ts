import { CustomerMapper } from '../customer.mapper';
import { Customer } from '../../../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../../entities/customer.orm-entity';

describe('CustomerMapper', () => {
    const domainCustomer = Customer.create({
        id: '123e4567-e89b-12d3-a456-426614174001',
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '3001234567',
    }).getValue();

    it('should map domain to orm', () => {
        const orm = CustomerMapper.toOrm(domainCustomer);
        expect(orm.id).toBe(domainCustomer.id);
        expect(orm.email).toBe('juan@example.com');
    });

    it('should map orm to domain', () => {
        const orm = new CustomerOrmEntity();
        orm.id = domainCustomer.id;
        orm.fullName = domainCustomer.fullName;
        orm.email = domainCustomer.email;
        orm.phone = domainCustomer.phone;
        orm.createdAt = new Date();
        orm.updatedAt = new Date();

        const result = CustomerMapper.toDomain(orm);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().fullName).toBe('Juan Pérez');
    });
});