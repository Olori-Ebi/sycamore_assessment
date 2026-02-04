import { Router } from 'express';
import {
    transferController,
} from '../controller/transfer.controller';

const router = Router();

router.get('/health', transferController.healthCheck);
router.post('/transfer', transferController.transferFunds);

export default router;