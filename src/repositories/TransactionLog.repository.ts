import TransactionLog from '../models/TransactionLog';


/**
 * Repository responsible for managing transaction logs.
 * Supports idempotency and transactional state updates.
*/
class TransactionRepository {

    /**
     * Find a transaction using its idempotency key.
     * Applies row-level locking to prevent duplicate concurrent processing.
     *
     * @param idempotencyKey - Unique idempotency identifier
     * @param tx - Optional Sequelize transaction
     * @returns The transaction log or null if not found
    */
    async findByIdempotencyKey(idempotencyKey: string, tx?: any) {
        return TransactionLog.findOne({
            where: { idempotencyKey },
            transaction: tx,
            lock: tx?.LOCK.UPDATE,
        });
    }


    /**
     * Create a new transaction log entry.
     *
     * @param data - Transaction creation payload
     * @param tx - Optional Sequelize transaction
     * @returns Created transaction log
    */
    async create(data: {
        fromWalletId: string;
        toWalletId: string;
        amount: string;
        status: 'pending' | 'success' | 'failed';
        idempotencyKey: string;
    }, tx?: any) {
        return TransactionLog.create(data, { transaction: tx });
    }

    /**
     * Update the status of an existing transaction.
     *
     * @param transaction - Transaction log instance
     * @param status - New transaction status
     * @param tx - Optional Sequelize transaction
     * @returns Updated transaction log
    */
    async updateStatus(transaction: TransactionLog, status: 'pending' | 'success' | 'failed', tx?: any) {
        transaction.status = status;
        return transaction.save({ transaction: tx });
    }
}

/**
 * Singleton instance of TransactionRepository.
 */
export const transactionRepository = new TransactionRepository();