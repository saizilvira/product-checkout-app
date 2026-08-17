import { Product } from '../entities/product.entity';
import { Result } from '../../shared/result';

export interface ProductRepository {
    findById(id: string): Promise<Result<Product>>;
    findAll(): Promise<Result<Product[]>>;
    save(product: Product): Promise<Result<Product>>;
    updateStock(id: string, newStock: number): Promise<Result<Product>>;
}

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');