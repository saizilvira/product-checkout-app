import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryRepository } from '../../../../domain/repositories/delivery.repository';
import { Delivery } from '../../../../domain/entities/delivery.entity';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';
import { DeliveryMapper } from '../mappers/delivery.mapper';
import { Result } from '../../../../shared/result';

@Injectable()
export class DeliveryRepositoryImpl implements DeliveryRepository {
    constructor(
        @InjectRepository(DeliveryOrmEntity)
        private readonly repo: Repository<DeliveryOrmEntity>,
    ) { }

    async findById(id: string): Promise<Result<Delivery>> {
        try {
            const orm = await this.repo.findOne({ where: { id } });
            if (!orm) {
                return Result.fail(new Error('Delivery not found'));
            }
            return DeliveryMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async save(delivery: Delivery): Promise<Result<Delivery>> {
        try {
            const orm = DeliveryMapper.toOrm(delivery);
            const saved = await this.repo.save(orm);
            return DeliveryMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}