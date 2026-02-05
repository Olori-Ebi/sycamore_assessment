// src/middlewares/transferValidator.ts
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation rules for /transfer endpoint
 */
export const transferValidationRules = [
    body('fromWalletId').isUUID().withMessage('fromWalletId must be a valid UUID'),
    body('toWalletId').isUUID().withMessage('toWalletId must be a valid UUID'),
    body('amount')
        .isDecimal({ decimal_digits: '0,2' })
        .withMessage('amount must be a valid number with up to 2 decimal places')
        .custom((value) => parseFloat(value) > 0)
        .withMessage('amount must be greater than 0'),
    body('idempotencyKey').isString().withMessage('idempotencyKey is required'),
];

/**
 * Middleware to check validation results
 */
export const validateTransfer = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
