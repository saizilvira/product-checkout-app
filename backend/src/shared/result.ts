export class Result<T, E = Error> {
    private constructor(
        private readonly _value?: T,
        private readonly _error?: E,
        private readonly _isSuccess: boolean = false,
    ) { }

    static ok<T>(value: T): Result<T> {
        return new Result<T>(value, undefined, true);
    }

    static fail<E>(error: E): Result<never, E> {
        return new Result<never, E>(undefined, error, false);
    }

    isSuccess(): boolean {
        return this._isSuccess;
    }

    isFailure(): boolean {
        return !this._isSuccess;
    }

    getValue(): T {
        if (!this._isSuccess) {
            throw new Error('Cannot get value from a failed result');
        }
        return this._value as T;
    }

    getError(): E {
        if (this._isSuccess) {
            throw new Error('Cannot get error from a successful result');
        }
        return this._error as E;
    }

    // Métodos útiles para ROP
    map<U>(fn: (value: T) => U): Result<U, E> {
        if (this.isFailure()) {
            return Result.fail(this.getError());
        }
        return Result.ok(fn(this.getValue()));
    }

    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isFailure()) {
            return Result.fail(this.getError());
        }
        return fn(this.getValue());
    }
}