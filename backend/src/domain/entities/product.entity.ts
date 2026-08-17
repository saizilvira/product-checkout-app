import { Result } from '../../shared/result';
import { Money } from '../value-objects/money.vo';

interface ProductProps {
    id: string;
    name: string;
    description: string;
    price: Money;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Product {
    private constructor(private readonly props: ProductProps) { }

    static create(props: {
        id: string;
        name: string;
        description: string;
        priceInCents: number;
        stock: number;
        imageUrl?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Result<Product> {
        if (!props.name || props.name.trim().length === 0) {
            return Result.fail(new Error('Product name is required'));
        }

        if (props.stock < 0) {
            return Result.fail(new Error('Stock cannot be negative'));
        }

        const priceResult = Money.create(props.priceInCents);
        if (priceResult.isFailure()) {
            return Result.fail(priceResult.getError());
        }

        const now = new Date();

        return Result.ok(
            new Product({
                id: props.id,
                name: props.name.trim(),
                description: props.description?.trim() || '',
                price: priceResult.getValue(),
                stock: props.stock,
                imageUrl: props.imageUrl,
                createdAt: props.createdAt || now,
                updatedAt: props.updatedAt || now,
            }),
        );
    }

    get id(): string {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get description(): string {
        return this.props.description;
    }

    get price(): Money {
        return this.props.price;
    }

    get stock(): number {
        return this.props.stock;
    }

    get imageUrl(): string | undefined {
        return this.props.imageUrl;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    hasStock(quantity = 1): boolean {
        return this.props.stock >= quantity;
    }

    decreaseStock(quantity = 1): Result<Product> {
        if (!this.hasStock(quantity)) {
            return Result.fail(new Error('Insufficient stock'));
        }

        return Product.create({
            id: this.props.id,
            name: this.props.name,
            description: this.props.description,
            priceInCents: this.props.price.amountInCents,
            stock: this.props.stock - quantity,
            imageUrl: this.props.imageUrl,
            createdAt: this.props.createdAt,
            updatedAt: new Date(),
        });
    }
}