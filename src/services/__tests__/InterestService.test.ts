import Decimal from 'decimal.js';
import { interestService } from '../interest.service';

describe('InterestService', () => {
    it('calculates daily interest correctly for a non-leap year', () => {
        const principal = new Decimal(1000);
        const days = 30;
        const interest = interestService.calculateDailyInterest(principal, days, 2023);
        expect(interest.toNumber()).toBeCloseTo(22.60, 2);
    });

    it('calculates daily interest correctly for a leap year', () => {
        const principal = new Decimal(1000);
        const days = 30;
        const interest = interestService.calculateDailyInterest(principal, days, 2024);
        expect(interest.toNumber()).toBeCloseTo(22.54, 2);
    });

    it('handles 0 principal', () => {
        const interest = interestService.calculateDailyInterest(new Decimal(0), 10, 2023);
        expect(interest.toNumber()).toBe(0);
    });

    it('handles fractional principal', () => {
        const interest = interestService.calculateDailyInterest(new Decimal(1234.56), 15, 2023);
        expect(interest.toNumber()).toBeCloseTo(13.95, 2);
    });
});

