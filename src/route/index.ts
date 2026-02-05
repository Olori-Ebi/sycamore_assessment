import { Router } from 'express';
import {
    transferController,
} from '../controller/transfer.controller';
import { transferValidationRules, validateTransfer } from '../middleware/transferValidator';

const router = Router();

router.get('/health', transferController.healthCheck);
router.post('/transfer', transferValidationRules,
    validateTransfer, transferController.transferFunds);

export default router;