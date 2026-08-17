import { DeliveryMapper } from '../delivery.mapper';
import { Delivery } from '../../../../../domain/entities/delivery.entity';
import { DeliveryOrmEntity } from '../../entities/delivery.orm-entity';

describe('DeliveryMapper', () => {
    const domainDelivery = Delivery.create({
        id: '123e4567-e89b-12d3-a456-426614174003',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        address: 'Calle 123',
        city: 'Bogotá',
        region: 'Cundinamarca',
    }).getValue();

    it('should map domain to orm', () => {
        const orm = DeliveryMapper.toOrm(domainDelivery);
        expect(orm.address).toBe('Calle 123');
        expect(orm.city).toBe('Bogotá');
    });

    it('should map orm to domain', () => {
        const orm = new DeliveryOrmEntity();
        orm.id = domainDelivery.id;
        orm.customerId = domainDelivery.customerId;
        orm.address = domainDelivery.address;
        orm.city = domainDelivery.city;
        orm.region = domainDelivery.region;
        orm.createdAt = new Date();
        orm.updatedAt = new Date();

        const result = DeliveryMapper.toDomain(orm);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().city).toBe('Bogotá');
    });
});