import { api } from './api'
import type { CustomerData, DeliveryData, Transaction } from '@/types'

export interface CreateTransactionPayload {
    productId: string
    customer: CustomerData
    delivery: DeliveryData
    cardBrand?: string
    cardLastFour?: string
}

export interface ProcessPaymentPayload {
    transactionId: string
    paymentSourceId: string
    customerEmail: string
}

export async function createTransaction(
    payload: CreateTransactionPayload,
): Promise<Transaction> {
    const { data } = await api.post<Transaction>('/transactions', payload)
    return data
}

export async function processPayment(
    payload: ProcessPaymentPayload,
): Promise<Transaction> {
    const { data } = await api.post<Transaction>('/transactions/process-payment', payload)
    return data
}

export async function getTransaction(id: string): Promise<Transaction> {
    const { data } = await api.get<Transaction>(`/transactions/${id}`)
    return data
}