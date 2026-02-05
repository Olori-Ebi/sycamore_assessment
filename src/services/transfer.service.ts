import Wallet from '../models/Wallet';
import Decimal from 'decimal.js';
import { transactionRepository } from '../repositories/TransactionLog.repository';
import { walletRepository } from '../repositories/Wallet.repository';
import { ledgerRepository } from '../repositories/Ledger.repository';

export class TransferService {
    constructor(
        private transactionRepo = transactionRepository,
        private walletRepo = walletRepository,
        private ledgerRepo = ledgerRepository,
    ) { }
    async transferFunds(payload: {
        fromWalletId: string;
        toWalletId: string;
        amount: number;
        idempotencyKey: string;
    }) {
        const { fromWalletId, toWalletId, amount, idempotencyKey } = payload;
        const tx = await Wallet.sequelize!.transaction();

        try {
            // Check for existing transaction
            const existing = await this.transactionRepo.findByIdempotencyKey(idempotencyKey, tx);
            if (existing) {
                if (existing.status === 'pending') throw new Error('Transaction already in progress');
                return existing;
            }

            // Create transaction log
            const transaction = await this.transactionRepo.create({
                fromWalletId,
                toWalletId,
                amount: amount.toString(),
                status: 'pending',
                idempotencyKey,
            }, tx);

            // Lock wallets
            const [fromWallet, toWallet] = await Promise.all([
                this.walletRepo.findById(fromWalletId, tx),
                this.walletRepo.findById(toWalletId, tx),
            ]);

            if (!fromWallet || !toWallet) {
                await this.transactionRepo.updateStatus(transaction, 'failed', tx);
                throw new Error('Invalid wallet IDs');
            }

            const fromBalance = new Decimal(fromWallet.balance);
            const toBalance = new Decimal(toWallet.balance);
            const amountDecimal = new Decimal(amount);

            if (fromBalance.lessThan(amountDecimal)) {
                await this.transactionRepo.updateStatus(transaction, 'failed', tx);
                throw new Error('Insufficient funds');
            }

            // Update balances
            await this.walletRepo.updateBalance(fromWallet, fromBalance.minus(amountDecimal).toFixed(2), tx);
            await this.walletRepo.updateBalance(toWallet, toBalance.plus(amountDecimal).toFixed(2), tx);

            // Create ledger entries
            await this.ledgerRepo.createBulk([
                { walletId: fromWallet.id, transactionId: transaction.id, type: 'debit', amount: amountDecimal.toFixed(2), balanceAfter: fromWallet.balance },
                { walletId: toWallet.id, transactionId: transaction.id, type: 'credit', amount: amountDecimal.toFixed(2), balanceAfter: toWallet.balance },
            ], tx);

            // Mark transaction success
            await this.transactionRepo.updateStatus(transaction, 'success', tx);

            await tx.commit();
            return transaction.dataValues;
        } catch (error) {
            await tx.rollback();
            console.error('Transfer failed:', error);
            throw error;
        }
    }
}

/**
 * Singleton instance of TransferService.
 */
export const transferService = new TransferService();