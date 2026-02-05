import cron from 'node-cron';
import Decimal from 'decimal.js';
import Wallet from '../../models/Wallet';
import { interestService } from '../interest.service';

/**
 * @fileoverview
 * Cron job that calculates and records daily interest for all wallets.
 *
 * Schedule: Runs **daily at midnight** (server time).
 * Uses decimal.js for precise arithmetic and persists interest
 * to the WalletInterest table via InterestService.
*/

/**
 * Cron job: Runs daily at midnight.
 */
cron.schedule('0 0 * * *', async () => {
    console.log('Running interest job...');

    // Fetch all wallets
    const wallets = await Wallet.findAll();
    console.log(`Found ${wallets.length} wallets.`);

    // Calculate and record interest for each wallet
    for (const wallet of wallets) {
        await interestService.recordInterest(
            wallet.id,
            new Decimal(wallet.balance),
            1,
            new Date()
        );
    }
});
