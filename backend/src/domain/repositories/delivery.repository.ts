import { Delivery } from '../entities/delivery.entity';
import { Result } from '../../shared/result';

export interface DeliveryRepository {
    findById(id: string): Promise<Result<Delivery>>;
    save(delivery: Delivery): Promise<Result<Delivery>>;
}

export const DELIVERY_REPOSITORY = Symbol('DELIVERY_REPOSITORY');