import { Inject, Injectable } from '@nestjs/common';
import {
    PRODUCT_REPOSITORY,
    ProductRepository,
} from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { Result } from '../../shared/result';

@Injectable()
export class GetProductUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(productId?: string): Promise<Result<Product>> {
        if (productId) {
            return this.productRepository.findById(productId);
        }

        // Si no se envía ID, devolvemos el primer producto (para este test solo hay uno)
        const productsResult = await this.productRepository.findAll();
        if (productsResult.isFailure()) {
            return Result.fail(productsResult.getError());
        }

        const products = productsResult.getValue();
        if (products.length === 0) {
            return Result.fail(new Error('No products available'));
        }

        return Result.ok(products[0]);
    }
}