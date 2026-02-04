import { TransactionRepository } from '../repositories/TransactionLog.repository';
import { WalletRepository } from '../repositories/Wallet.repository';
import { LedgerRepository } from '../repositories/Ledger.repository';
import Wallet from '../models/Wallet';
import Decimal from 'decimal.js';

const transactionRepo = new TransactionRepository();
const walletRepo = new WalletRepository();
const ledgerRepo = new LedgerRepository();

export class TransferService {
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
            const existing = await transactionRepo.findByIdempotencyKey(idempotencyKey, tx);
            if (existing) {
                if (existing.status === 'pending') throw new Error('Transaction already in progress');
                return existing;
            }

            // Create transaction log
            const transaction = await transactionRepo.create({
                fromWalletId,
                toWalletId,
                amount: amount.toString(),
                status: 'pending',
                idempotencyKey,
            }, tx);

            // Lock wallets
            const [fromWallet, toWallet] = await Promise.all([
                walletRepo.findById(fromWalletId, tx),
                walletRepo.findById(toWalletId, tx),
            ]);

            if (!fromWallet || !toWallet) {
                await transactionRepo.updateStatus(transaction, 'failed', tx);
                throw new Error('Invalid wallet IDs');
            }
            
            const fromBalance = new Decimal(fromWallet.balance);
            const toBalance = new Decimal(toWallet.balance);
            const amountDecimal = new Decimal(amount);

            if (fromBalance.lessThan(amountDecimal)) {
                await transactionRepo.updateStatus(transaction, 'failed', tx);
                throw new Error('Insufficient funds');
            }

            // Update balances
            await walletRepo.updateBalance(fromWallet, fromBalance.minus(amountDecimal).toFixed(2), tx);
            await walletRepo.updateBalance(toWallet, toBalance.plus(amountDecimal).toFixed(2), tx);

            // Create ledger entries
            await ledgerRepo.createBulk([
                { walletId: fromWallet.id, transactionId: transaction.id, type: 'debit', amount: amountDecimal.toFixed(2), balanceAfter: fromWallet.balance },
                { walletId: toWallet.id, transactionId: transaction.id, type: 'credit', amount: amountDecimal.toFixed(2), balanceAfter: toWallet.balance },
            ], tx);

            // Mark transaction success
            await transactionRepo.updateStatus(transaction, 'success', tx);

            await tx.commit();
            return transaction;
        } catch (error) {
            await tx.rollback();
            console.error('Transfer failed:', error);
            throw error;
        }
    }
}

export const transferService = new TransferService();