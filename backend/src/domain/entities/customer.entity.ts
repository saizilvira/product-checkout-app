import { Result } from '../../shared/result';

interface CustomerProps {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    documentType?: string;
    documentNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Customer {
    private constructor(private readonly props: CustomerProps) { }

    static create(props: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        documentType?: string;
        documentNumber?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }): Result<Customer> {
        if (!props.fullName || props.fullName.trim().length === 0) {
            return Result.fail(new Error('Customer full name is required'));
        }

        if (!props.email || !this.isValidEmail(props.email)) {
            return Result.fail(new Error('Valid email is required'));
        }

        const now = new Date();

        return Result.ok(
            new Customer({
                id: props.id,
                fullName: props.fullName.trim(),
                email: props.email.trim().toLowerCase(),
                phone: props.phone?.trim(),
                documentType: props.documentType?.trim(),
                documentNumber: props.documentNumber?.trim(),
                createdAt: props.createdAt || now,
                updatedAt: props.updatedAt || now,
            }),
        );
    }

    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    get id(): string {
        return this.props.id;
    }

    get fullName(): string {
        return this.props.fullName;
    }

    get email(): string {
        return this.props.email;
    }

    get phone(): string | undefined {
        return this.props.phone;
    }

    get documentType(): string | undefined {
        return this.props.documentType;
    }

    get documentNumber(): string | undefined {
        return this.props.documentNumber;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}