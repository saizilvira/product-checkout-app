import { PaymentGatewayService } from '../payment-gateway.service';
import { of, throwError } from 'rxjs';

describe('PaymentGatewayService', () => {
    const mockConfig = {
        get: jest.fn((key: string) => {
            const map: Record<string, string> = {
                PAYMENT_BASE_URL: 'https://api.test',
                PAYMENT_PUBLIC_KEY: 'pub_test',
                PAYMENT_PRIVATE_KEY: 'prv_test',
                PAYMENT_INTEGRITY_SECRET: 'secret',
            };
            return map[key];
        }),
    };

    const mockHttp = {
        get: jest.fn(),
        post: jest.fn(),
    };

    let service: PaymentGatewayService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new PaymentGatewayService(mockConfig as any, mockHttp as any);
    });

    it('creates payment successfully', async () => {
        mockHttp.get.mockReturnValue(
            of({ data: { data: { presigned_acceptance: { acceptance_token: 'acc_123' } } } }),
        );
        mockHttp.post.mockReturnValue(
            of({ data: { data: { id: 'tx_1', status: 'APPROVED', status_message: 'ok' } } }),
        );

        const result = await service.createPayment({
            reference: 'ref_1',
            amountInCents: 10000,
            currency: 'COP',
            customerEmail: 'a@test.com',
            paymentSourceId: 'tok_1',
        });

        expect(result.isSuccess()).toBe(true);
        expect(result.getValue().status).toBe('APPROVED');
    });

    it('fails when gateway returns error', async () => {
        mockHttp.get.mockReturnValue(
            of({ data: { data: { presigned_acceptance: { acceptance_token: 'acc_123' } } } }),
        );
        mockHttp.post.mockReturnValue(throwError(() => ({ message: 'Gateway error' })));

        const result = await service.createPayment({
            reference: 'ref_1',
            amountInCents: 10000,
            currency: 'COP',
            customerEmail: 'a@test.com',
            paymentSourceId: 'tok_1',
        });

        expect(result.isFailure()).toBe(true);
    });
});