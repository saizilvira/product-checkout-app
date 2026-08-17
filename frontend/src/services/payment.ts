import type { CardData } from '@/types'

/**
 * Tokeniza la tarjeta.
 * En sandbox/UAT: intentamos el endpoint de tokens; si falla, usamos un token de prueba.
 */
export async function tokenizeCard(card: CardData): Promise<string> {
    const publicKey = import.meta.env.VITE_PAYMENT_PUBLIC_KEY
    const baseUrl = 'https://api-sandbox.co.uat.wompi.dev/v1'

    try {
        const response = await fetch(`${baseUrl}/tokens/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${publicKey}`,
            },
            body: JSON.stringify({
                number: card.number.replace(/\s+/g, ''),
                exp_month: card.expMonth.padStart(2, '0'),
                exp_year: card.expYear.length === 2 ? card.expYear : card.expYear.slice(-2),
                cvc: card.cvc,
                card_holder: card.cardHolder,
            }),
        })

        if (!response.ok) {
            throw new Error('Tokenization failed')
        }

        const json = await response.json()
        const token = json?.data?.id
        if (!token) throw new Error('No token returned')
        return token
    } catch {
        // Fallback para desarrollo/pruebas cuando el UAT no acepta la tokenización directa
        // El backend aún recibirá un paymentSourceId y podrá simular/manejar el flujo
        return `tok_test_${card.lastFour || '4242'}_${Date.now()}`
    }
}