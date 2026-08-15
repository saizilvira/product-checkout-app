import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../../../domain/repositories/product.repository';
import { Product } from '../../../../domain/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { ProductMapper } from '../mappers/product.mapper';
import { Result } from '../../../../shared/result';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
    constructor(
        @InjectRepository(ProductOrmEntity)
        private readonly repo: Repository<ProductOrmEntity>,
    ) { }

    async findById(id: string): Promise<Result<Product>> {
        try {
            const orm = await this.repo.findOne({ where: { id } });
            if (!orm) {
                return Result.fail(new Error('Product not found'));
            }
            return ProductMapper.toDomain(orm);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async findAll(): Promise<Result<Product[]>> {
        try {
            const orms = await this.repo.find();
            const products: Product[] = [];

            for (const orm of orms) {
                const result = ProductMapper.toDomain(orm);
                if (result.isFailure()) {
                    return Result.fail(result.getError());
                }
                products.push(result.getValue());
            }

            return Result.ok(products);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async save(product: Product): Promise<Result<Product>> {
        try {
            const orm = ProductMapper.toOrm(product);
            const saved = await this.repo.save(orm);
            return ProductMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }

    async updateStock(id: string, newStock: number): Promise<Result<Product>> {
        try {
            const orm = await this.repo.findOne({ where: { id } });
            if (!orm) {
                return Result.fail(new Error('Product not found'));
            }

            orm.stock = newStock;
            const saved = await this.repo.save(orm);
            return ProductMapper.toDomain(saved);
        } catch (error) {
            return Result.fail(error as Error);
        }
    }
}