export type CardBrand = 'VISA' | 'MASTERCARD' | 'UNKNOWN'

export function detectCardBrand(number: string): CardBrand {
    const cleaned = number.replace(/\s+/g, '')

    if (/^4/.test(cleaned)) return 'VISA'
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'MASTERCARD'

    return 'UNKNOWN'
}

export function formatCardNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    const parts = cleaned.match(/.{1,4}/g)
    return parts ? parts.join(' ') : cleaned
}

export function isValidCardNumber(number: string): boolean {
    const cleaned = number.replace(/\s+/g, '')
    if (!/^\d{13,16}$/.test(cleaned)) return false

    // Algoritmo de Luhn (estructura real de tarjetas)
    let sum = 0
    let shouldDouble = false
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10)
        if (shouldDouble) {
            digit *= 2
            if (digit > 9) digit -= 9
        }
        sum += digit
        shouldDouble = !shouldDouble
    }
    return sum % 10 === 0
}