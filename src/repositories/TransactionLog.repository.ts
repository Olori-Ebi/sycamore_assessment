import TransactionLog from '../models/TransactionLog';

export class TransactionRepository {
    async findByIdempotencyKey(idempotencyKey: string, tx?: any) {
        return TransactionLog.findOne({
            where: { idempotencyKey },
            transaction: tx,
            lock: tx?.LOCK.UPDATE,
        });
    }

    async create(data: {
        fromWalletId: string;
        toWalletId: string;
        amount: string;
        status: 'pending' | 'success' | 'failed';
        idempotencyKey: string;
    }, tx?: any) {
        return TransactionLog.create(data, { transaction: tx });
    }

    async updateStatus(transaction: TransactionLog, status: 'pending' | 'success' | 'failed', tx?: any) {
        transaction.status = status;
        return transaction.save({ transaction: tx });
    }
}
