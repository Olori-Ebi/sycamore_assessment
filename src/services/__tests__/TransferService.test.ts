import { TransferService } from '../transfer.service';
import { TransactionRepository } from '../../repositories/TransactionLog.repository';
import { WalletRepository } from '../../repositories/Wallet.repository';
import { LedgerRepository } from '../../repositories/Ledger.repository';
import Decimal from 'decimal.js';

// Mock repositories
jest.mock('../../repositories/TransactionLog.repository');
jest.mock('../../repositories/Wallet.repository');
jest.mock('../../repositories/Ledger.repository');

describe('TransferService', () => {
  let transferService: TransferService;
  let transactionRepoMock: jest.Mocked<TransactionRepository>;
  let walletRepoMock: jest.Mocked<WalletRepository>;
  let ledgerRepoMock: jest.Mocked<LedgerRepository>;

  beforeEach(() => {
    transactionRepoMock = new TransactionRepository() as jest.Mocked<TransactionRepository>;
    walletRepoMock = new WalletRepository() as jest.Mocked<WalletRepository>;
    ledgerRepoMock = new LedgerRepository() as jest.Mocked<LedgerRepository>;
    transferService = new TransferService();
    
    // Override internal repo instances with mocks
    (transferService as any).transactionRepo = transactionRepoMock;
    (transferService as any).walletRepo = walletRepoMock;
    (transferService as any).ledgerRepo = ledgerRepoMock;
  });

it('should transfer funds successfully', async () => {
  const payload = { fromWalletId: 'wallet1', toWalletId: 'wallet2', amount: 100, idempotencyKey: 'abc123' };

  const fromWallet = { id: 'wallet1', balance: '1000', save: jest.fn().mockResolvedValue({}) };
  const toWallet = { id: 'wallet2', balance: '500', save: jest.fn().mockResolvedValue({}) };
  const transaction = { id: 'tx1', status: 'pending', save: jest.fn().mockResolvedValue({}), dataValues: {} };

  transactionRepoMock.findByIdempotencyKey.mockResolvedValue(null);
  transactionRepoMock.create.mockResolvedValue(transaction as any);
  
  walletRepoMock.findById.mockImplementation(async (id) => {
    if (id === 'wallet1') return fromWallet as any;
    if (id === 'wallet2') return toWallet as any;
    return null;
  });

  ledgerRepoMock.createBulk.mockResolvedValue([]);
  walletRepoMock.updateBalance.mockImplementation(async (wallet, balance) => {
    wallet.balance = balance;
    return wallet;
  });

  const result = await transferService.transferFunds(payload);

  expect(fromWallet.balance).toBe(new Decimal(1000).minus(100).toFixed(2));
  expect(toWallet.balance).toBe(new Decimal(500).plus(100).toFixed(2));
  expect(result).toBe(transaction.dataValues);
});


  it('should fail if fromWallet has insufficient funds', async () => {
    const payload = { fromWalletId: 'wallet1', toWalletId: 'wallet2', amount: 1000, idempotencyKey: 'abc124' };
    const fromWallet = { id: 'wallet1', balance: '500', save: jest.fn() };
    const toWallet = { id: 'wallet2', balance: '500', save: jest.fn() };
    const transaction = { id: 'tx2', status: 'pending', save: jest.fn(), dataValues: {} };

    transactionRepoMock.findByIdempotencyKey.mockResolvedValue(null);
    transactionRepoMock.create.mockResolvedValue(transaction as any);
walletRepoMock.findById.mockImplementation(async (id) => {
  switch (id) {
    case fromWallet.id:
      return fromWallet as any;
    case toWallet.id:
      return toWallet as any;
    default:
      return null;
  }
});


    await expect(transferService.transferFunds(payload)).rejects.toThrow('Insufficient funds');
    expect(transactionRepoMock.updateStatus).toHaveBeenCalledWith(transaction, 'failed', expect.anything());
  });
});
