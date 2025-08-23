import { Router } from "express";
import { getWalletInfo, getTestnetObject } from "../controllers/suiController";

const router = Router();

router.get("/wallet-info/:address", getWalletInfo);
router.get("/testnet-object", getTestnetObject);

export default router;
