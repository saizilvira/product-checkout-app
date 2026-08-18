import { DeliveryRepositoryImpl } from '../delivery.repository.impl';
import { Delivery } from '../../../../../domain/entities/delivery.entity';

describe('DeliveryRepositoryImpl', () => {
    const mockRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    let repository: DeliveryRepositoryImpl;

    const domainDelivery = Delivery.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        address: '123 Main St',
        city: 'Metropolis',
        region: 'State',
        postalCode: '12345',
        phone: '123456789',
    }).getValue();

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new DeliveryRepositoryImpl(mockRepo as any);
    });

    it('findById returns delivery when found', async () => {
        mockRepo.findOne.mockResolvedValue({
            id: domainDelivery.id,
            customerId: domainDelivery.customerId,
            address: domainDelivery.address,
            city: domainDelivery.city,
            region: domainDelivery.region,
            postalCode: domainDelivery.postalCode,
            phone: domainDelivery.phone,
            createdAt: new Date(),
            updatedAt: new Date(),
            customer: { id: domainDelivery.customerId }
        });

        const result = await repository.findById(domainDelivery.id);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().address).toBe('123 Main St');
    });

    it('findById fails when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findById('missing');
        expect(result.isFailure()).toBe(true);
    });

    it('save persists delivery', async () => {
        mockRepo.save.mockResolvedValue({
            id: domainDelivery.id,
            customerId: domainDelivery.customerId,
            address: domainDelivery.address,
            city: domainDelivery.city,
            region: domainDelivery.region,
            postalCode: domainDelivery.postalCode,
            phone: domainDelivery.phone,
            createdAt: new Date(),
            updatedAt: new Date(),
            customer: { id: domainDelivery.customerId }
        });

        const result = await repository.save(domainDelivery);
        expect(result.isSuccess()).toBe(true);
    });
});
