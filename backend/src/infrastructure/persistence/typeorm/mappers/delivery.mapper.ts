import { Delivery } from '../../../../domain/entities/delivery.entity';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';
import { Result } from '../../../../shared/result';

export class DeliveryMapper {
    static toDomain(orm: DeliveryOrmEntity): Result<Delivery> {
        return Delivery.create({
            id: orm.id,
            customerId: orm.customerId,
            address: orm.address,
            city: orm.city,
            region: orm.region,
            postalCode: orm.postalCode,
            phone: orm.phone,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: Delivery): DeliveryOrmEntity {
        const orm = new DeliveryOrmEntity();
        orm.id = domain.id;
        orm.customerId = domain.customerId;
        orm.address = domain.address;
        orm.city = domain.city;
        orm.region = domain.region;
        orm.postalCode = domain.postalCode;
        orm.phone = domain.phone;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}