import { DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ProductOrmEntity } from '../entities/product.orm-entity';

export async function seedProduct(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(ProductOrmEntity);

    const existingProducts = await productRepository.count();
    if (existingProducts > 0) {
        console.log('Products already seeded. Skipping...');
        return;
    }

    const product = productRepository.create({
        id: uuidv4(),
        name: 'Auriculares Inalámbricos Pro',
        description:
            'Auriculares bluetooth con cancelación de ruido activa, 30 horas de batería y sonido de alta fidelidad. Ideales para trabajo y entretenimiento.',
        priceInCents: 15990000, // $159.900 COP
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
    });

    await productRepository.save(product);
    console.log('Product seeded successfully:', product.name);
}