import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionRepository } from '../../../../domain/repositories/transaction.repository';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { TransactionMapper } from '../mappers/transaction.mapper';
import { Result } from '../../../../shared/result';

@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(
        @InjectRepository(TransactionOrmEntity)
        private readonly repo: Repository<TransactionOrmEntity>,
    ) { }

    async findById(id: string): Promise<Result<Transaction>> {
        try {
            const orm = await this.repo.findOne({ where: { id } });
            if (!orm) {
                return Result.fail(new Error('Transaction not found'));
            }
            return TransactionMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async findByReference(reference: string): Promise<Result<Transaction>> {
        try {
            const orm = await this.repo.findOne({ where: { reference } });
            if (!orm) {
                return Result.fail(new Error('Transaction not found'));
            }
            return TransactionMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async save(transaction: Transaction): Promise<Result<Transaction>> {
        try {
            const orm = TransactionMapper.toOrm(transaction);
            const saved = await this.repo.save(orm);
            return TransactionMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async update(transaction: Transaction): Promise<Result<Transaction>> {
        try {
            const orm = TransactionMapper.toOrm(transaction);
            const saved = await this.repo.save(orm);
            return TransactionMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}