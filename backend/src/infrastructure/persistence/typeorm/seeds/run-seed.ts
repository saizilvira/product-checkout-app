import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ProductOrmEntity } from '../entities/product.orm-entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';
import { DeliveryOrmEntity } from '../entities/delivery.orm-entity';
import { TransactionOrmEntity } from '../entities/transaction.orm-entity';
import { seedProduct } from './product.seed';

config(); // carga el .env

async function run() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [
            ProductOrmEntity,
            CustomerOrmEntity,
            DeliveryOrmEntity,
            TransactionOrmEntity,
        ],
        synchronize: true,
    });

    try {
        await dataSource.initialize();
        console.log('Database connected');

        await seedProduct(dataSource);

        await dataSource.destroy();
        console.log('Seed completed');
    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

run();