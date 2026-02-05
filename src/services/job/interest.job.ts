import cron from 'node-cron';
import Decimal from 'decimal.js';
import Wallet from '../../models/Wallet';
import { interestService } from '../interest.service';

cron.schedule('0 0 * * *', async () => {
    console.log('Running interest job...');
    const wallets = await Wallet.findAll();
    console.log(`Found ${wallets.length} wallets.`);
    for (const wallet of wallets) {
        await interestService.recordInterest(
            wallet.id,
            new Decimal(wallet.balance),
            1,
            new Date()
        );
    }
});
