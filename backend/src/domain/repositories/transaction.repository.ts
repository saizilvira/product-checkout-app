import { Transaction } from '../entities/transaction.entity';
import { Result } from '../../shared/result';

export interface TransactionRepository {
    findById(id: string): Promise<Result<Transaction>>;
    findByReference(reference: string): Promise<Result<Transaction>>;
    save(transaction: Transaction): Promise<Result<Transaction>>;
    update(transaction: Transaction): Promise<Result<Transaction>>;
}

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');