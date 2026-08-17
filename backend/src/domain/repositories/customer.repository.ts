import { Customer } from '../entities/customer.entity';
import { Result } from '../../shared/result';

export interface CustomerRepository {
    findById(id: string): Promise<Result<Customer>>;
    findByEmail(email: string): Promise<Result<Customer | null>>;
    save(customer: Customer): Promise<Result<Customer>>;
}

export const CUSTOMER_REPOSITORY = Symbol('CUSTOMER_REPOSITORY');