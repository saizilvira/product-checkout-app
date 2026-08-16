import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import {
    PRODUCT_REPOSITORY,
} from '../../domain/repositories/product.repository';
import type { ProductRepository } from '../../domain/repositories/product.repository';

import {
    CUSTOMER_REPOSITORY,
} from '../../domain/repositories/customer.repository';
import type { CustomerRepository } from '../../domain/repositories/customer.repository';

import {
    DELIVERY_REPOSITORY,
} from '../../domain/repositories/delivery.repository';
import type { DeliveryRepository } from '../../domain/repositories/delivery.repository';

import {
    TRANSACTION_REPOSITORY,
} from '../../domain/repositories/transaction.repository';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository';

import { Customer } from '../../domain/entities/customer.entity';
import { Delivery } from '../../domain/entities/delivery.entity';
import { Transaction } from '../../domain/entities/transaction.entity';
import { Result } from '../../shared/result';
import { BASE_FEE_IN_CENTS, DELIVERY_FEE_IN_CENTS } from '../constants';

export interface CreateTransactionInput {
    productId: string;
    customer: {
        fullName: string;
        email: string;
        phone?: string;
        documentType?: string;
        documentNumber?: string;
    };
    delivery: {
        address: string;
        city: string;
        region?: string;
        postalCode?: string;
        phone?: string;
    };
    cardBrand?: string;
    cardLastFour?: string;
}

@Injectable()
export class CreateTransactionUseCase {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository,
        @Inject(CUSTOMER_REPOSITORY)
        private readonly customerRepository: CustomerRepository,
        @Inject(DELIVERY_REPOSITORY)
        private readonly deliveryRepository: DeliveryRepository,
        @Inject(TRANSACTION_REPOSITORY)
        private readonly transactionRepository: TransactionRepository,
    ) { }

    async execute(input: CreateTransactionInput): Promise<Result<Transaction>> {
        // 1. Validar producto y stock
        const productResult = await this.productRepository.findById(input.productId);
        if (productResult.isFailure()) {
            return Result.fail(productResult.getError());
        }

        const product = productResult.getValue();
        if (!product.hasStock(1)) {
            return Result.fail(new Error('Product out of stock'));
        }

        // 2. Crear o reutilizar customer
        const existingCustomerResult = await this.customerRepository.findByEmail(
            input.customer.email,
        );
        if (existingCustomerResult.isFailure()) {
            return Result.fail(existingCustomerResult.getError());
        }

        let customer = existingCustomerResult.getValue();

        if (!customer) {
            const customerResult = Customer.create({
                id: uuidv4(),
                fullName: input.customer.fullName,
                email: input.customer.email,
                phone: input.customer.phone,
                documentType: input.customer.documentType,
                documentNumber: input.customer.documentNumber,
            });

            if (customerResult.isFailure()) {
                return Result.fail(customerResult.getError());
            }

            const saveCustomerResult = await this.customerRepository.save(
                customerResult.getValue(),
            );
            if (saveCustomerResult.isFailure()) {
                return Result.fail(saveCustomerResult.getError());
            }

            customer = saveCustomerResult.getValue();
        }

        // 3. Crear delivery
        const deliveryResult = Delivery.create({
            id: uuidv4(),
            customerId: customer.id,
            address: input.delivery.address,
            city: input.delivery.city,
            region: input.delivery.region,
            postalCode: input.delivery.postalCode,
            phone: input.delivery.phone,
        });

        if (deliveryResult.isFailure()) {
            return Result.fail(deliveryResult.getError());
        }

        const saveDeliveryResult = await this.deliveryRepository.save(
            deliveryResult.getValue(),
        );
        if (saveDeliveryResult.isFailure()) {
            return Result.fail(saveDeliveryResult.getError());
        }

        const delivery = saveDeliveryResult.getValue();

        // 4. Crear transacción en PENDING
        const reference = `txn_${Date.now()}_${uuidv4().slice(0, 8)}`;

        const transactionResult = Transaction.create({
            id: uuidv4(),
            reference,
            productId: product.id,
            customerId: customer.id,
            deliveryId: delivery.id,
            amountInCents: product.price.amountInCents,
            baseFeeInCents: BASE_FEE_IN_CENTS,
            deliveryFeeInCents: DELIVERY_FEE_IN_CENTS,
            paymentMethodType: 'CARD',
            cardBrand: input.cardBrand,
            cardLastFour: input.cardLastFour,
            currency: 'COP',
        });

        if (transactionResult.isFailure()) {
            return Result.fail(transactionResult.getError());
        }

        return this.transactionRepository.save(transactionResult.getValue());
    }
}