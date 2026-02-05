import Decimal from 'decimal.js';
import WalletInterest from '../models/WalletInterest';

/**
 * Annual interest rate (27.5% per annum).
 * Stored as Decimal to avoid floating-point precision errors.
 */
const ANNUAL_RATE = new Decimal(0.275);


/**
 * Service responsible for calculating and persisting wallet interest.
 *
 * - Uses Decimal.js for precise financial calculations
 * - Handles leap year logic to ensure accurate daily rates
 * - Persists interest records for auditing and reconciliation
 */
class InterestService {
    /**
     * Calculates accrued interest for a given principal over a number of days.
     *
     * The daily interest rate is derived from the annual rate and adjusted
     * based on whether the provided year is a leap year.
     *
     * @param principal - The principal amount on which interest is calculated
     * @param days - Number of days interest should be accrued for
     * @param year - Calendar year used to determine days in year (365 or 366)
     * @returns The calculated interest, rounded to 4 decimal places
     */
    calculateDailyInterest(principal: Decimal, days: number, year: number): Decimal {
        const daysInYear = this.isLeapYear(year) ? 366 : 365;
        const dailyRate = ANNUAL_RATE.div(daysInYear);
        return principal.mul(dailyRate).mul(days).toDecimalPlaces(4);
    }


    /**
 * Determines whether a given year is a leap year.
 *
 * @param year - The year to evaluate
 * @returns True if the year is a leap year, otherwise false
 */
    private isLeapYear(year: number): boolean {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Calculates and persists interest for a wallet.
     *
     * This method:
     * - Computes interest using precise decimal arithmetic
     * - Stores both the principal and interest as fixed-precision strings
     * - Records the calculation date for traceability
     *
     * @param walletId - Unique identifier of the wallet
     * @param principal - Principal balance used for interest calculation
     * @param days - Number of days interest is calculated for
     * @param date - Date the interest is calculated for
     * @returns A persisted WalletInterest record
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

/**
 * Singleton instance of InterestService
 */
export const interestService = new InterestService();
