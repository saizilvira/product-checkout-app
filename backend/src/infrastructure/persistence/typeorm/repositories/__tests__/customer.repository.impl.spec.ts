import { CustomerRepositoryImpl } from '../customer.repository.impl';
import { Customer } from '../../../../../domain/entities/customer.entity';

describe('CustomerRepositoryImpl', () => {
    const mockRepo = {
        findOne: jest.fn(),
        save: jest.fn(),
    };

    let repository: CustomerRepositoryImpl;

    const domainCustomer = Customer.create({
        id: '123e4567-e89b-12d3-a456-426614174000',
        fullName: 'Test Customer',
        email: 'test@example.com',
        phone: '123456789',
        documentType: 'CC',
        documentNumber: '123456789',
    }).getValue();

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new CustomerRepositoryImpl(mockRepo as any);
    });

    it('findById returns customer when found', async () => {
        mockRepo.findOne.mockResolvedValue({
            id: domainCustomer.id,
            fullName: domainCustomer.fullName,
            email: domainCustomer.email,
            phone: domainCustomer.phone,
            documentType: domainCustomer.documentType,
            documentNumber: domainCustomer.documentNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await repository.findById(domainCustomer.id);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().fullName).toBe('Test Customer');
    });

    it('findById fails when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findById('missing');
        expect(result.isFailure()).toBe(true);
    });

    it('findByEmail returns customer when found', async () => {
        mockRepo.findOne.mockResolvedValue({
            id: domainCustomer.id,
            fullName: domainCustomer.fullName,
            email: domainCustomer.email,
            phone: domainCustomer.phone,
            documentType: domainCustomer.documentType,
            documentNumber: domainCustomer.documentNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await repository.findByEmail(domainCustomer.email);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()?.email).toBe('test@example.com');
    });

    it('findByEmail returns null when not found', async () => {
        mockRepo.findOne.mockResolvedValue(null);
        const result = await repository.findByEmail('missing@example.com');
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue()).toBeNull();
    });

    it('save persists customer', async () => {
        mockRepo.save.mockResolvedValue({
            id: domainCustomer.id,
            fullName: domainCustomer.fullName,
            email: domainCustomer.email,
            phone: domainCustomer.phone,
            documentType: domainCustomer.documentType,
            documentNumber: domainCustomer.documentNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await repository.save(domainCustomer);
        expect(result.isSuccess()).toBe(true);
    });
});
