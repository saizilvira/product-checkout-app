import { Customer } from '../../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { Result } from '../../../../shared/result';

export class CustomerMapper {
    static toDomain(orm: CustomerOrmEntity): Result<Customer> {
        return Customer.create({
            id: orm.id,
            fullName: orm.fullName,
            email: orm.email,
            phone: orm.phone,
            documentType: orm.documentType,
            documentNumber: orm.documentNumber,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: Customer): CustomerOrmEntity {
        const orm = new CustomerOrmEntity();
        orm.id = domain.id;
        orm.fullName = domain.fullName;
        orm.email = domain.email;
        orm.phone = domain.phone;
        orm.documentType = domain.documentType;
        orm.documentNumber = domain.documentNumber;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}