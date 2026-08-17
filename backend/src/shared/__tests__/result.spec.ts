import { Result } from '../result';

describe('Result', () => {
    it('should create a successful result', () => {
        const result = Result.ok(42);
        expect(result.isSuccess()).toBe(true);
        expect(result.isFailure()).toBe(false);
        expect(result.getValue()).toBe(42);
    });

    it('should create a failed result', () => {
        const result = Result.fail(new Error('Something went wrong'));
        expect(result.isFailure()).toBe(true);
        expect(result.isSuccess()).toBe(false);
        expect(result.getError().message).toBe('Something went wrong');
    });

    it('should throw when getting value from failed result', () => {
        const result = Result.fail(new Error('fail'));
        expect(() => result.getValue()).toThrow();
    });

    it('should throw when getting error from successful result', () => {
        const result = Result.ok(1);
        expect(() => result.getError()).toThrow();
    });

    it('should map a successful result', () => {
        const result = Result.ok(10);
        const mapped = result.map((v) => v * 2);
        expect(mapped.isSuccess()).toBe(true);
        expect(mapped.getValue()).toBe(20);
    });

    it('should not map a failed result', () => {
        const result = Result.fail<number, Error>(new Error('fail'));
        const mapped = result.map((v) => v * 2);
        expect(mapped.isFailure()).toBe(true);
    });

    it('should flatMap a successful result', () => {
        const result = Result.ok(5);
        const flatMapped = result.flatMap((v) => Result.ok(v + 3));
        expect(flatMapped.isSuccess()).toBe(true);
        expect(flatMapped.getValue()).toBe(8);
    });

    it('should not flatMap a failed result', () => {
        const result = Result.fail<number, Error>(new Error('fail'));
        const flatMapped = result.flatMap((v) => Result.ok(v + 3));
        expect(flatMapped.isFailure()).toBe(true);
    });
});