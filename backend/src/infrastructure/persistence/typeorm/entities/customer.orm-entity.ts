import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerOrmEntity {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ name: 'full_name', type: 'varchar', length: 255 })
    fullName: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    phone?: string;

    @Column({ name: 'document_type', type: 'varchar', length: 10, nullable: true })
    documentType?: string;

    @Column({ name: 'document_number', type: 'varchar', length: 50, nullable: true })
    documentNumber?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}