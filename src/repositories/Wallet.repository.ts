import Wallet from '../models/Wallet';

/**
 * Repository responsible for wallet persistence and balance updates.
 * Handles row-level locking to ensure consistency during concurrent transactions.
 */
class WalletRepository {

    /**
 * Fetch a wallet by its primary key.
 * Applies a row-level lock when used inside a transaction to prevent race conditions.
 *
 * @param id - Wallet unique identifier
 * @param tx - Optional Sequelize transaction
 * @returns The wallet instance or null if not found
 */
    async findById(id: string, tx?: any) {
        return Wallet.findByPk(id, { transaction: tx, lock: tx?.LOCK.UPDATE });
    }

    /**
 * Update a wallet balance within a transaction.
 *
 * @param wallet - Wallet instance to update
 * @param newBalance - New balance as a string to preserve precision
 * @param tx - Optional Sequelize transaction
 * @returns Updated wallet instance
 */
    async updateBalance(wallet: Wallet, newBalance: string, tx?: any) {
        wallet.balance = newBalance;
        return wallet.save({ transaction: tx });
    }
}

/**
 * Singleton instance of WalletRepository.
 */
export const walletRepository = new WalletRepository();