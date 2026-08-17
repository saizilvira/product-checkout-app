import { Product } from '../../../../domain/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { Result } from '../../../../shared/result';

export class ProductMapper {
    static toDomain(orm: ProductOrmEntity): Result<Product> {
        return Product.create({
            id: orm.id,
            name: orm.name,
            description: orm.description,
            priceInCents: orm.priceInCents,
            stock: orm.stock,
            imageUrl: orm.imageUrl,
            createdAt: orm.createdAt,
            updatedAt: orm.updatedAt,
        });
    }

    static toOrm(domain: Product): ProductOrmEntity {
        const orm = new ProductOrmEntity();
        orm.id = domain.id;
        orm.name = domain.name;
        orm.description = domain.description;
        orm.priceInCents = domain.price.amountInCents;
        orm.stock = domain.stock;
        orm.imageUrl = domain.imageUrl;
        orm.createdAt = domain.createdAt;
        orm.updatedAt = domain.updatedAt;
        return orm;
    }
}