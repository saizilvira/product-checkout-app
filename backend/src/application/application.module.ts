import { Module } from '@nestjs/common';
import { DatabaseModule } from '../infrastructure/persistence/database.module';
import { PaymentGatewayModule } from '../infrastructure/payment-gateway/payment-gateway.module';

import { GetProductUseCase } from './use-cases/get-product.use-case';
import { CreateTransactionUseCase } from './use-cases/create-transaction.use-case';
import { ProcessPaymentUseCase } from './use-cases/process-payment.use-case';

@Module({
    imports: [DatabaseModule, PaymentGatewayModule],
    providers: [
        GetProductUseCase,
        CreateTransactionUseCase,
        ProcessPaymentUseCase,
    ],
    exports: [
        GetProductUseCase,
        CreateTransactionUseCase,
        ProcessPaymentUseCase,
    ],
})
export class ApplicationModule { }