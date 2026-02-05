import { TransferService } from '../transfer.service';
import { transactionRepository } from '../../repositories/TransactionLog.repository';
import { walletRepository } from '../../repositories/Wallet.repository';
import { ledgerRepository } from '../../repositories/Ledger.repository';
import Wallet from '../../models/Wallet';
import Decimal from 'decimal.js';

// ---- Mock sequelize transaction ----
const commit = jest.fn();
const rollback = jest.fn();

(Wallet as any).sequelize = {
  transaction: jest.fn().mockResolvedValue({
    commit,
    rollback,
    LOCK: { UPDATE: 'UPDATE' },
  }),
};

// ---- Mock singleton repositories ----
jest.mock('../../repositories/TransactionLog.repository', () => ({
  transactionRepository: {
    findByIdempotencyKey: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
  },
}));

jest.mock('../../repositories/Wallet.repository', () => ({
  walletRepository: {
    findById: jest.fn(),
    updateBalance: jest.fn(),
  },
}));

jest.mock('../../repositories/Ledger.repository', () => ({
  ledgerRepository: {
    createBulk: jest.fn(),
  },
}));

describe('TransferService', () => {
  let transferService: TransferService;

  const transactionRepoMock =
    transactionRepository as jest.Mocked<typeof transactionRepository>;
  const walletRepoMock =
    walletRepository as jest.Mocked<typeof walletRepository>;
  const ledgerRepoMock =
    ledgerRepository as jest.Mocked<typeof ledgerRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    transferService = new TransferService();
  });

  it('should transfer funds successfully', async () => {
    const payload = {
      fromWalletId: 'wallet1',
      toWalletId: 'wallet2',
      amount: 100,
      idempotencyKey: 'abc123',
    };

    const fromWallet = { id: 'wallet1', balance: '1000.00' };
    const toWallet = { id: 'wallet2', balance: '500.00' };

    const transaction = {
      id: 'tx1',
      status: 'pending',
      dataValues: { id: 'tx1' },
    };

    transactionRepoMock.findByIdempotencyKey.mockResolvedValue(null as any);
    transactionRepoMock.create.mockResolvedValue(transaction as any);
    transactionRepoMock.updateStatus.mockResolvedValue(transaction as any);

    walletRepoMock.findById.mockImplementation(async (id) => {
      if (id === 'wallet1') return fromWallet as any;
      if (id === 'wallet2') return toWallet as any;
      return null;
    });

    walletRepoMock.updateBalance.mockImplementation(async (wallet, balance) => {
      wallet.balance = balance;
      return wallet as any;
    });

    ledgerRepoMock.createBulk.mockResolvedValue(undefined as any);

    const result = await transferService.transferFunds(payload);

    expect(fromWallet.balance).toBe(
      new Decimal(1000).minus(100).toFixed(2)
    );
    expect(toWallet.balance).toBe(
      new Decimal(500).plus(100).toFixed(2)
    );

    expect(transactionRepoMock.updateStatus).toHaveBeenCalledWith(
      transaction,
      'success',
      expect.anything()
    );

    expect(commit).toHaveBeenCalled();
    expect(result).toEqual(transaction.dataValues);
  });

  it('should fail if fromWallet has insufficient funds', async () => {
    const payload = {
      fromWalletId: 'wallet1',
      toWalletId: 'wallet2',
      amount: 1000,
      idempotencyKey: 'abc124',
    };

    const fromWallet = { id: 'wallet1', balance: '500.00' };
    const toWallet = { id: 'wallet2', balance: '500.00' };

    const transaction = {
      id: 'tx2',
      status: 'pending',
      dataValues: {},
    };

    transactionRepoMock.findByIdempotencyKey.mockResolvedValue(null as any);
    transactionRepoMock.create.mockResolvedValue(transaction as any);
    transactionRepoMock.updateStatus.mockResolvedValue(transaction as any);

    walletRepoMock.findById.mockImplementation(async (id) => {
      if (id === 'wallet1') return fromWallet as any;
      if (id === 'wallet2') return toWallet as any;
      return null;
    });

    await expect(
      transferService.transferFunds(payload)
    ).rejects.toThrow('Insufficient funds');

    expect(transactionRepoMock.updateStatus).toHaveBeenCalledWith(
      transaction,
      'failed',
      expect.anything()
    );

    expect(rollback).toHaveBeenCalled();
  });
});
