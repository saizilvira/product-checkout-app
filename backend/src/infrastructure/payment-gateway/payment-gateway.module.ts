import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentGatewayService } from './payment-gateway.service';
import { PAYMENT_GATEWAY } from '../../domain/repositories/payment-gateway.port';

@Module({
    imports: [HttpModule],
    providers: [
        {
            provide: PAYMENT_GATEWAY,
            useClass: PaymentGatewayService,
        },
    ],
    exports: [PAYMENT_GATEWAY],
})
export class PaymentGatewayModule { }