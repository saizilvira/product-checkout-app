import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './infrastructure/persistence/database.module';
import { ApplicationModule } from './application/application.module';
import { PaymentGatewayModule } from './infrastructure/payment-gateway/payment-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    PaymentGatewayModule,
    ApplicationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }