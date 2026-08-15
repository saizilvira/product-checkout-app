import { Result } from '../../shared/result';

export enum TransactionStatusEnum {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    ERROR = 'ERROR',
}

export class TransactionStatus {
    private constructor(private readonly _value: TransactionStatusEnum) { }

    static create(value: string): Result<TransactionStatus> {
        const upperValue = value.toUpperCase();

        if (!Object.values(TransactionStatusEnum).includes(upperValue as TransactionStatusEnum)) {
            return Result.fail(new Error(`Invalid transaction status: ${value}`));
        }

        return Result.ok(new TransactionStatus(upperValue as TransactionStatusEnum));
    }

    static pending(): TransactionStatus {
        return new TransactionStatus(TransactionStatusEnum.PENDING);
    }

    get value(): TransactionStatusEnum {
        return this._value;
    }

    isPending(): boolean {
        return this._value === TransactionStatusEnum.PENDING;
    }

    isFinal(): boolean {
        return (
            this._value === TransactionStatusEnum.APPROVED ||
            this._value === TransactionStatusEnum.DECLINED ||
            this._value === TransactionStatusEnum.ERROR
        );
    }

    equals(other: TransactionStatus): boolean {
        return this._value === other.value;
    }
}