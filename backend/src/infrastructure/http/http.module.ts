import { Module } from '@nestjs/common';
import { ApplicationModule } from '../../application/application.module';
import { DatabaseModule } from '../persistence/database.module';
import { ProductController } from './controllers/product.controller';
import { TransactionController } from './controllers/transaction.controller';

@Module({
    imports: [ApplicationModule, DatabaseModule],
    controllers: [ProductController, TransactionController],
})
export class HttpModule { }