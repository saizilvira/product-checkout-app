export class Result<T, E = Error> {
    private constructor(
        private readonly _value?: T,
        private readonly _error?: E,
        private readonly _isSuccess: boolean = false,
    ) { }

    static ok<T, E = Error>(value: T): Result<T, E> {
        return new Result<T, E>(value, undefined, true);
    }

    static fail<T = never, E = Error>(error: E): Result<T, E> {
        return new Result<T, E>(undefined, error, false);
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

    map<U>(fn: (value: T) => U): Result<U, E> {
        if (this.isFailure()) {
            return Result.fail<U, E>(this.getError());
        }
        return Result.ok<U, E>(fn(this.getValue()));
    }

    flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
        if (this.isFailure()) {
            return Result.fail<U, E>(this.getError());
        }
        return fn(this.getValue());
    }
}