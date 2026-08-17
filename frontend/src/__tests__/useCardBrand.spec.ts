import {
    detectCardBrand,
    formatCardNumber,
    isValidCardNumber,
} from '@/composables/useCardBrand'

describe('useCardBrand', () => {
    describe('detectCardBrand', () => {
        it('detects VISA', () => {
            expect(detectCardBrand('4242424242424242')).toBe('VISA')
            expect(detectCardBrand('4')).toBe('VISA')
        })

        it('detects MASTERCARD', () => {
            expect(detectCardBrand('5555555555554444')).toBe('MASTERCARD')
            expect(detectCardBrand('2223000048400011')).toBe('MASTERCARD')
        })

        it('returns UNKNOWN for other numbers', () => {
            expect(detectCardBrand('6011111111111117')).toBe('UNKNOWN')
        })
    })

    describe('formatCardNumber', () => {
        it('formats in groups of 4', () => {
            expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242')
        })

        it('limits to 16 digits', () => {
            expect(formatCardNumber('42424242424242429999').replace(/\s/g, '').length).toBe(16)
        })
    })

    describe('isValidCardNumber', () => {
        it('validates Luhn for known test cards', () => {
            expect(isValidCardNumber('4242424242424242')).toBe(true)
            expect(isValidCardNumber('4111111111111111')).toBe(true)
        })

        it('rejects invalid numbers', () => {
            expect(isValidCardNumber('1234')).toBe(false)
            expect(isValidCardNumber('4242424242424241')).toBe(false)
        })
    })
})