import { Money } from '../money.vo';

describe('Money Value Object', () => {
    it('should create a valid Money', () => {
        const result = Money.create(10000);
        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().amountInCents).toBe(10000);
    });

    it('should fail with negative amount', () => {
        const result = Money.create(-100);
        expect(result.isFailure()).toBe(true);
    });

    it('should fail with non-integer amount', () => {
        const result = Money.create(10.5);
        expect(result.isFailure()).toBe(true);
    });

    it('should add two Money values correctly', () => {
        const money1 = Money.create(1000).getValue();
        const money2 = Money.create(2500).getValue();
        const result = money1.add(money2);

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().amountInCents).toBe(3500);
    });
});