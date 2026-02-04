import Decimal from 'decimal.js';
import WalletInterest from '../models/WalletInterest';

const ANNUAL_RATE = new Decimal(0.275);

class InterestService {
    /**
     * Calculate daily interest for a given principal and number of days
     */
    calculateDailyInterest(principal: Decimal, days: number, year: number): Decimal {
        const daysInYear = this.isLeapYear(year) ? 366 : 365;
        const dailyRate = ANNUAL_RATE.div(daysInYear);
        return principal.mul(dailyRate).mul(days).toDecimalPlaces(4);
    }

    private isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Persist daily interest to DB
     */
    async recordInterest(walletId: string, principal: Decimal, days: number, date: Date) {
        const year = date.getFullYear();
        const interest = this.calculateDailyInterest(principal, days, year);
        return WalletInterest.create({
            walletId,
            principal: principal.toFixed(2),
            interest: interest.toFixed(4),
            calculatedAt: date,
        });
    }
}

export const interestService = new InterestService();
