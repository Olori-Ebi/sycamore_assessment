import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";

/**
 * Handles HTTP requests related to wallet transfers.
 */
class TransferController {

    /**
 * Health check endpoint to verify service availability.
 *
 * @route GET /health
 * @returns {void} JSON response indicating service health
 */
    healthCheck(req: any, res: any): void {
        res.status(200).json({ status: 'OK', message: 'Service is healthy' });
    }

    /**
 * Transfers funds from one wallet to another.
 * Supports idempotent requests to prevent duplicate transfers.
 *
 * @route POST /transfer
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 *
 * @body
 *  - fromWalletId {string} Source wallet ID
 *  - toWalletId {string} Destination wallet ID
 *  - amount {string | number} Transfer amount
 *  - idempotencyKey {string} Unique request key
 *
 * @returns {Promise<void>} JSON response with transaction details
 */
    async transferFunds(req: Request, res: Response): Promise<void> {
        const { fromWalletId, toWalletId, amount, idempotencyKey } = req.body;

        try {
            const transaction = await transferService.transferFunds({ fromWalletId, toWalletId, amount, idempotencyKey });
            res.status(200).json({ status: 'OK', message: 'Funds transferred successfully', transaction });
            return;
        } catch (error) {
            res.status(500).json({ status: 'ERROR', message: 'Failed to transfer funds', error });
            return;
        }
    }
}

export const transferController = new TransferController();