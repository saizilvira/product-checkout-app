import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductOrmEntity } from './typeorm/entities/product.orm-entity';
import { CustomerOrmEntity } from './typeorm/entities/customer.orm-entity';
import { DeliveryOrmEntity } from './typeorm/entities/delivery.orm-entity';
import { TransactionOrmEntity } from './typeorm/entities/transaction.orm-entity';

import { ProductRepositoryImpl } from './typeorm/repositories/product.repository.impl';
import { CustomerRepositoryImpl } from './typeorm/repositories/customer.repository.impl';
import { DeliveryRepositoryImpl } from './typeorm/repositories/delivery.repository.impl';
import { TransactionRepositoryImpl } from './typeorm/repositories/transaction.repository.impl';

import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository';
import { CUSTOMER_REPOSITORY } from '../../domain/repositories/customer.repository';
import { DELIVERY_REPOSITORY } from '../../domain/repositories/delivery.repository';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/transaction.repository';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [
                    ProductOrmEntity,
                    CustomerOrmEntity,
                    DeliveryOrmEntity,
                    TransactionOrmEntity,
                ],
                synchronize: configService.get<string>('NODE_ENV') === 'development',
                logging: configService.get<string>('NODE_ENV') === 'development',
            }),
        }),
        TypeOrmModule.forFeature([
            ProductOrmEntity,
            CustomerOrmEntity,
            DeliveryOrmEntity,
            TransactionOrmEntity,
        ]),
    ],
    providers: [
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductRepositoryImpl,
        },
        {
            provide: CUSTOMER_REPOSITORY,
            useClass: CustomerRepositoryImpl,
        },
        {
            provide: DELIVERY_REPOSITORY,
            useClass: DeliveryRepositoryImpl,
        },
        {
            provide: TRANSACTION_REPOSITORY,
            useClass: TransactionRepositoryImpl,
        },
    ],
    exports: [
        PRODUCT_REPOSITORY,
        CUSTOMER_REPOSITORY,
        DELIVERY_REPOSITORY,
        TRANSACTION_REPOSITORY,
    ],
})
export class DatabaseModule { }