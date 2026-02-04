import Wallet from '../models/Wallet';

export class WalletRepository {
    async findById(id: string, tx?: any) {
        return Wallet.findByPk(id, { transaction: tx, lock: tx?.LOCK.UPDATE });
    }

    async updateBalance(wallet: Wallet, newBalance: string, tx?: any) {
        wallet.balance = newBalance;
        return wallet.save({ transaction: tx });
    }
}
