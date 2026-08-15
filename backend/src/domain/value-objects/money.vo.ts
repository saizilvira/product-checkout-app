import { Result } from '../../shared/result';

export class Money {
    private constructor(private readonly _amountInCents: number) { }

    static create(amountInCents: number): Result<Money> {
        if (!Number.isInteger(amountInCents)) {
            return Result.fail(new Error('Amount must be an integer (cents)'));
        }
        if (amountInCents < 0) {
            return Result.fail(new Error('Amount cannot be negative'));
        }
        return Result.ok(new Money(amountInCents));
    }

    get amountInCents(): number {
        return this._amountInCents;
    }

    add(other: Money): Result<Money> {
        return Money.create(this._amountInCents + other.amountInCents);
    }

    equals(other: Money): boolean {
        return this._amountInCents === other.amountInCents;
    }
}