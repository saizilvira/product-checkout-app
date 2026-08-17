import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepository } from '../../../../domain/repositories/customer.repository';
import { Customer } from '../../../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { CustomerMapper } from '../mappers/customer.mapper';
import { Result } from '../../../../shared/result';

@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
    constructor(
        @InjectRepository(CustomerOrmEntity)
        private readonly repo: Repository<CustomerOrmEntity>,
    ) { }

    async findById(id: string): Promise<Result<Customer>> {
        try {
            const orm = await this.repo.findOne({ where: { id } });
            if (!orm) {
                return Result.fail(new Error('Customer not found'));
            }
            return CustomerMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async findByEmail(email: string): Promise<Result<Customer | null>> {
        try {
            const orm = await this.repo.findOne({ where: { email } });
            if (!orm) {
                return Result.ok(null);
            }
            return CustomerMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async save(customer: Customer): Promise<Result<Customer>> {
        try {
            const orm = CustomerMapper.toOrm(customer);
            const saved = await this.repo.save(orm);
            return CustomerMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}