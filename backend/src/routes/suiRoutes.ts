
import { Router } from 'express';
import { getWalletInfo } from '../controllers/suiController';

const router = Router();

router.get('/wallet-info/:address', getWalletInfo);

export default router;
