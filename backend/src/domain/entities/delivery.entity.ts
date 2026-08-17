import { Result } from '../../shared/result';

interface DeliveryProps {
    id: string;
    customerId: string;
    address: string;
    city: string;
    region?: string;
    postalCode?: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Delivery {
    private constructor(private readonly props: DeliveryProps) { }

    static create(props: {
        id: string;
        customerId: string;
        address: string;
        city: string;
        region?: string;
        postalCode?: string;
        phone?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Result<Delivery> {
        if (!props.address || props.address.trim().length === 0) {
            return Result.fail(new Error('Delivery address is required'));
        }

        if (!props.city || props.city.trim().length === 0) {
            return Result.fail(new Error('Delivery city is required'));
        }

        if (!props.customerId) {
            return Result.fail(new Error('Customer ID is required'));
        }

        const now = new Date();

        return Result.ok(
            new Delivery({
                id: props.id,
                customerId: props.customerId,
                address: props.address.trim(),
                city: props.city.trim(),
                region: props.region?.trim(),
                postalCode: props.postalCode?.trim(),
                phone: props.phone?.trim(),
                createdAt: props.createdAt || now,
                updatedAt: props.updatedAt || now,
            }),
        );
    }

    get id(): string {
        return this.props.id;
    }

    get customerId(): string {
        return this.props.customerId;
    }

    get address(): string {
        return this.props.address;
    }

    get city(): string {
        return this.props.city;
    }

    get region(): string | undefined {
        return this.props.region;
    }

    get postalCode(): string | undefined {
        return this.props.postalCode;
    }

    get phone(): string | undefined {
        return this.props.phone;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}