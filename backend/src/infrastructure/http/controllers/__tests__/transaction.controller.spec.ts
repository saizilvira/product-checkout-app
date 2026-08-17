import { TransactionController } from '../transaction.controller';
import { Result } from '../../../../shared/result';
import { Transaction } from '../../../../domain/entities/transaction.entity';
import { HttpException } from '@nestjs/common';

describe('TransactionController', () => {
    const mockCreate = { execute: jest.fn() };
    const mockProcess = { execute: jest.fn() };
    const mockTxRepo = { findById: jest.fn() };

    let controller: TransactionController;

    const tx = Transaction.create({
        id: '123e4567-e89b-12d3-a456-426614174002',
        reference: 'txn_1',
        productId: '123e4567-e89b-12d3-a456-426614174000',
        customerId: '123e4567-e89b-12d3-a456-426614174001',
        deliveryId: '123e4567-e89b-12d3-a456-426614174003',
        amountInCents: 10000,
        baseFeeInCents: 500000,
        deliveryFeeInCents: 800000,
    }).getValue();

    beforeEach(() => {
        jest.clearAllMocks();
        controller = new TransactionController(
            mockCreate as any,
            mockProcess as any,
            mockTxRepo as any,
        );
    });

    it('creates transaction', async () => {
        mockCreate.execute.mockResolvedValue(Result.ok(tx));
        const result = await controller.createTransaction({
            productId: tx.productId,
            customer: { fullName: 'A', email: 'a@a.com' },
            delivery: { address: 'Calle 1', city: 'Bogota' },
        } as any);
        expect(result.reference).toBe('txn_1');
    });

    it('throws on create failure', async () => {
        mockCreate.execute.mockResolvedValue(Result.fail(new Error('fail')));
        await expect(
            controller.createTransaction({} as any),
        ).rejects.toThrow(HttpException);
    });

    it('processes payment', async () => {
        mockProcess.execute.mockResolvedValue(Result.ok(tx));
        const result = await controller.processPayment({
            transactionId: tx.id,
            paymentSourceId: 'tok_1',
            customerEmail: 'a@a.com',
        });
        expect(result.id).toBe(tx.id);
    });

    it('gets transaction by id', async () => {
        mockTxRepo.findById.mockResolvedValue(Result.ok(tx));
        const result = await controller.getTransaction(tx.id);
        expect(result.status).toBe('PENDING');
    });

    it('throws when transaction not found', async () => {
        mockTxRepo.findById.mockResolvedValue(Result.fail(new Error('not found')));
        await expect(controller.getTransaction(tx.id)).rejects.toThrow(HttpException);
    });
});