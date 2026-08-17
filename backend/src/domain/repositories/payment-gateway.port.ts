import { Result } from '../../shared/result';

export interface CreatePaymentInput {
    reference: string;
    amountInCents: number;
    currency: string;
    customerEmail: string;
    paymentSourceId?: string; // token de la tarjeta
    // datos adicionales según la API
}

export interface PaymentResult {
    transactionId: string;
    status: 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';
    statusMessage?: string;
}

export interface PaymentGatewayPort {
    createPayment(input: CreatePaymentInput): Promise<Result<PaymentResult>>;
}

export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');