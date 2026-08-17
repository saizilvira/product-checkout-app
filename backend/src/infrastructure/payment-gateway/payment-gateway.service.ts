import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import {
    PaymentGatewayPort,
    CreatePaymentInput,
    PaymentResult,
} from '../../domain/repositories/payment-gateway.port';
import { Result } from '../../shared/result';

@Injectable()
export class PaymentGatewayService implements PaymentGatewayPort {
    private readonly baseUrl: string;
    private readonly publicKey: string;
    private readonly privateKey: string;
    private readonly integritySecret: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {
        this.baseUrl = this.configService.get<string>('PAYMENT_BASE_URL')!;
        this.publicKey = this.configService.get<string>('PAYMENT_PUBLIC_KEY')!;
        this.privateKey = this.configService.get<string>('PAYMENT_PRIVATE_KEY')!;
        this.integritySecret = this.configService.get<string>('PAYMENT_INTEGRITY_SECRET')!;
    }

    async createPayment(input: CreatePaymentInput): Promise<Result<PaymentResult>> {
        try {
            const integritySignature = this.generateIntegritySignature(
                input.reference,
                input.amountInCents,
                input.currency,
            );

            const payload = {
                acceptance_token: await this.getAcceptanceToken(),
                amount_in_cents: input.amountInCents,
                currency: input.currency,
                customer_email: input.customerEmail,
                payment_method: {
                    type: 'CARD',
                    token: input.paymentSourceId, // token de la tarjeta
                    installments: 1,
                },
                reference: input.reference,
                signature: integritySignature,
            };

            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/transactions`, payload, {
                    headers: {
                        Authorization: `Bearer ${this.privateKey}`,
                        'Content-Type': 'application/json',
                    },
                }),
            );

            const data = response.data?.data;

            if (!data) {
                return Result.fail(new Error('Invalid response from payment gateway'));
            }

            const status = this.mapStatus(data.status);

            return Result.ok({
                transactionId: data.id,
                status,
                statusMessage: data.status_message,
            });
        } catch (error: any) {
            const message =
                error?.response?.data?.error?.reason ||
                error?.response?.data?.message ||
                error.message ||
                'Payment gateway error';

            return Result.fail(new Error(message));
        }
    }

    /**
     * Genera la firma de integridad requerida por la pasarela.
     * Formato: SHA256(reference + amount_in_cents + currency + integrity_secret)
     */
    private generateIntegritySignature(
        reference: string,
        amountInCents: number,
        currency: string,
    ): string {
        const concatenated = `${reference}${amountInCents}${currency}${this.integritySecret}`;
        return crypto.createHash('sha256').update(concatenated).digest('hex');
    }

    /**
     * Obtiene el acceptance_token (requerido por la API).
     */
    private async getAcceptanceToken(): Promise<string> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/merchants/${this.publicKey}`, {
                    headers: {
                        Authorization: `Bearer ${this.publicKey}`,
                    },
                }),
            );

            return response.data?.data?.presigned_acceptance?.acceptance_token;
        } catch (error) {
            throw new Error('Could not retrieve acceptance token');
        }
    }

    private mapStatus(
        status: string,
    ): 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING' {
        const upper = (status || '').toUpperCase();

        if (upper === 'APPROVED') return 'APPROVED';
        if (upper === 'DECLINED') return 'DECLINED';
        if (upper === 'PENDING' || upper === 'PENDING_CONFIRMATION') return 'PENDING';
        return 'ERROR';
    }
}