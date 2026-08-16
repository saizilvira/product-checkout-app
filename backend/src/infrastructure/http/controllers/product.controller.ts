import { Controller, Get, Param, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { GetProductUseCase } from '../../../application/use-cases/get-product.use-case';

@Controller('products')
export class ProductController {
    constructor(private readonly getProductUseCase: GetProductUseCase) { }

    @Get()
    async getProduct() {
        const result = await this.getProductUseCase.execute();

        if (result.isFailure()) {
            throw new HttpException(result.getError().message, HttpStatus.NOT_FOUND);
        }

        const product = result.getValue();

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            priceInCents: product.price.amountInCents,
            stock: product.stock,
            imageUrl: product.imageUrl,
        };
    }

    @Get(':id')
    async getProductById(@Param('id', ParseUUIDPipe) id: string) {
        const result = await this.getProductUseCase.execute(id);

        if (result.isFailure()) {
            throw new HttpException(result.getError().message, HttpStatus.NOT_FOUND);
        }

        const product = result.getValue();

        return {
            id: product.id,
            name: product.name,
            description: product.description,
            priceInCents: product.price.amountInCents,
            stock: product.stock,
            imageUrl: product.imageUrl,
        };
    }
}