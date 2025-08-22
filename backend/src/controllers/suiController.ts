import { Request, Response } from "express";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });

export const getWalletInfo = async (req: Request, res: Response) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    // Get all coins first
    const balances = await suiClient.getAllBalances({ owner: address });
    console.log("Balance:", balances);
    let suiBalance = 0;
    // Get coin metadata for all coin types
    const uniqueCoinTypes = [...new Set(balances.map((c) => c.coinType))];

    const decimalsMap = new Map();
    for (const coinType of uniqueCoinTypes) {
      try {
        const metadata = await suiClient.getCoinMetadata({ coinType });
        // const metadata = [{
        //   decimals: 9,
        //   name: "Sui v2 (migrate: suiv2.com)",
        //   symbol: "SUI",
        //   description: "complete bride",
        //   iconUrl:
        //     "https://s3.coinmarketcap.com/static-gravity/image/5bd0f43855f6434386c59f2341c5aaf0.png",
        //   id: "0x9e180e43426a364f471310149791dcabaf39f052da61ad1dec7fab279b84cd51",
        // }];

        if (metadata) {
          decimalsMap.set(coinType, metadata.decimals);
        }
      } catch (error) {
        console.warn(`Failed to get metadata for ${coinType}:`, error);
        // Use default decimals if metadata fetch fails
        decimalsMap.set(coinType, coinType === "0x2::sui::SUI" ? 9 : 6);
      }
    }

    // Process coins to get a summary
    const tokenBalances: {
      [key: string]: { amount: number; coinType: string };
    } = {};

    for (const coin of balances) {
      const decimals = decimalsMap.get(coin.coinType) ?? 9;
      const amount = Number(coin.totalBalance) / Math.pow(10, decimals);

      // Check if this is SUI coin
      if (coin.coinType === "0x2::sui::SUI") {
        suiBalance += amount;
      } else {
        // Handle other tokens
        if (tokenBalances[coin.coinType]) {
          tokenBalances[coin.coinType].amount += amount;
        } else {
          tokenBalances[coin.coinType] = {
            amount,
            coinType: coin.coinType,
          };
        }
      }
    }

    res.json({
      suiBalance,
      tokens: Object.values(tokenBalances),
    });
  } catch (error) {
    console.error("Error fetching wallet info:", error);
    res.status(500).json({ error: "Failed to fetch wallet information" });
  }
};
