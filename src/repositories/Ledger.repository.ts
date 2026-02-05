import Ledger from '../models/Ledger';

/**
 * Repository responsible for persisting ledger entries.
 * Used to maintain an immutable audit trail of wallet movements.
*/
class LedgerRepository {

  /**
   * Create multiple ledger entries in a single operation.
   *
   * @param entries - Array of ledger entry payloads
   * @param tx - Optional Sequelize transaction
   * @returns Created ledger records
  */
  async createBulk(entries: Partial<Ledger>[], tx?: any) {
    return Ledger.bulkCreate(entries, { transaction: tx });
  }
}

/**
 * Singleton instance of LedgerRepository.
 */
export const ledgerRepository = new LedgerRepository();