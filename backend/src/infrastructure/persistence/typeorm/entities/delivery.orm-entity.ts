import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('deliveries')
export class DeliveryOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;

    @Column({ type: 'varchar', length: 500 })
    address: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region?: string;

    @Column({ name: 'postal_code', type: 'varchar', length: 20, nullable: true })
    postalCode?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}