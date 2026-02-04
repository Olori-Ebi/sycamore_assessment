import { Request, Response } from "express";
import { transferService } from "../services/transfer.service";

class TransferController {
    healthCheck(req: any, res: any): void {
        res.status(200).json({ status: 'OK', message: 'Service is healthy' });
    }

    async transferFunds(req: Request, res: Response) {
        const { fromWalletId, toWalletId, amount, idempotencyKey } = req.body;

        try {
            const transaction = await transferService.transferFunds({ fromWalletId, toWalletId, amount, idempotencyKey });
            res.status(200).json({ status: 'OK', message: 'Funds transferred successfully', transaction });
        } catch (error) {
            res.status(500).json({ status: 'ERROR', message: 'Failed to transfer funds', error });
        }
    }
}

export const transferController = new TransferController();