import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    reference: string;

    @Column({ name: 'payment_gateway_transaction_id', type: 'varchar', length: 100, nullable: true })
    paymentGatewayTransactionId?: string;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;

    @Column({ name: 'delivery_id', type: 'uuid' })
    deliveryId: string;

    @Column({ name: 'amount_in_cents', type: 'integer' })
    amountInCents: number;

    @Column({ name: 'base_fee_in_cents', type: 'integer' })
    baseFeeInCents: number;

    @Column({ name: 'delivery_fee_in_cents', type: 'integer' })
    deliveryFeeInCents: number;

    @Column({ name: 'total_in_cents', type: 'integer' })
    totalInCents: number;

    @Column({ type: 'varchar', length: 30 })
    status: string;

    @Column({ name: 'payment_method_type', type: 'varchar', length: 30, nullable: true })
    paymentMethodType?: string;

    @Column({ name: 'card_brand', type: 'varchar', length: 30, nullable: true })
    cardBrand?: string;

    @Column({ name: 'card_last_four', type: 'varchar', length: 4, nullable: true })
    cardLastFour?: string;

    @Column({ type: 'varchar', length: 3, default: 'COP' })
    currency: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}