import Ledger from '../models/Ledger';

export class LedgerRepository {
  async createBulk(entries: Partial<Ledger>[], tx?: any) {
    return Ledger.bulkCreate(entries, { transaction: tx });
  }
}