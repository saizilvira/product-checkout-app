export interface Product {
    id: string
    name: string
    description: string
    priceInCents: number
    stock: number
    imageUrl?: string
}

export interface CustomerData {
    fullName: string
    email: string
    phone?: string
    documentType?: string
    documentNumber?: string
}

export interface DeliveryData {
    address: string
    city: string
    region?: string
    postalCode?: string
    phone?: string
}

export interface CardData {
    number: string
    expMonth: string
    expYear: string
    cvc: string
    cardHolder: string
    brand?: 'VISA' | 'MASTERCARD' | 'UNKNOWN'
    lastFour?: string
}

export interface Transaction {
    id: string
    reference: string
    status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR'
    amountInCents: number
    baseFeeInCents: number
    deliveryFeeInCents: number
    totalInCents: number
    currency: string
    paymentGatewayTransactionId?: string
    cardBrand?: string
    cardLastFour?: string
}

export type CheckoutStep = 'product' | 'payment-info' | 'summary' | 'result'