import { Request, Response } from "express";
import { MoveStruct, MoveValue, SuiClient, SuiParsedData, getFullnodeUrl } from "@mysten/sui.js/client";
import { blockCoins, blockObjects } from "../config/blocks";

const suiClient = new SuiClient({ url: getFullnodeUrl("mainnet") });
const testSuiClient = new SuiClient({ url: getFullnodeUrl("testnet") });
function hasKey<T extends string>(
  fields: MoveStruct,
  key: T
): fields is Record<T, any> & Exclude<MoveStruct, MoveValue[]> {
  return typeof fields === 'object' &&
    fields !== null &&
    !Array.isArray(fields) &&
    key in fields;
}



export const getWalletInfo = async (req: Request, res: Response) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    // Get all coins first
    let hasNextPage: boolean = true
    let nextCursor: string | null | undefined = null
    const objects: SuiParsedData[] = []
    while (hasNextPage) {
      const paginatedObjectsResponse = await suiClient.getOwnedObjects({
        owner: address,
        cursor: nextCursor,
        options: { showContent: true }
      });


      hasNextPage = paginatedObjectsResponse.hasNextPage;
      nextCursor = paginatedObjectsResponse.nextCursor;

      if (paginatedObjectsResponse.data) {
        const validContents = paginatedObjectsResponse.data
          .map((d) => d.data?.content)
          .filter((content): content is SuiParsedData => content !== null && content !== undefined);

        objects.push(...validContents);
      }
    }
    let suiBalance = 0;
    const tokens: MoveStruct[] = []
    const nfts: MoveStruct[] = []

    for (let object of objects) {
      if (object?.dataType == "package") continue
      if (object?.dataType == "moveObject"
        && (blockCoins.blocklist.includes(object?.type) || blockObjects.blocklist.includes(object.type))) {
        continue
      }
      if (hasKey(object.fields, "balance")) {
        tokens.push(object)
      } else if (hasKey(object.fields, "image_url") || hasKey(object.fields, "img_url") || hasKey(object.fields, "url")) {
        nfts.push(object)
      }

    }
    const uniqueCoinTypes = [...new Set(tokens?.map((token) => {
      if (hasKey(token, "type")) {
        const extracted = token.type?.match(/<(.+?)>/)?.[1] || "";
        if (
          ((extracted as string).includes("::sui::SUI")||(extracted as string).includes("::asui::ASUI"))
          && extracted.toString() != "0x2::sui::SUI") return null
        console.log(extracted)
        return extracted;
      }
      return null;
    }).filter(Boolean))];



    const metaDataMap = new Map();
    for (const coinType of uniqueCoinTypes) {
      try {
        if (!coinType) continue
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
          metaDataMap.set(coinType, metadata);
        }
      } catch (error) {
        console.warn(`Failed to get metadata for ${coinType}:`, error);
      }
    }

    // // Process coins to get a summary
    const tokenData: {
      [key: string]: { amount: number; symbol: string; coinType: string, name: string, icon: string };
    } = {};

    for (const token of tokens) {
    
      if (!hasKey(token, "type") || !hasKey(token, "fields") || !hasKey(token.fields, "balance")) continue
      const coinType = token.type?.match(/<(.+?)>/)?.[1] || ""
      if (!metaDataMap.has(coinType)) continue;
      const decimals = metaDataMap.get(coinType)?.decimals ?? 9;
      const amount = Number(token.fields.balance || 0) / Math.pow(10, decimals);
      // Check if this is SUI coin
      if (coinType === "0x2::sui::SUI") {
        suiBalance += amount;
      } else {
        // Handle other tokens
        if (tokenData[coinType]) {
          tokenData[coinType].amount += amount;
        } else {
          tokenData[coinType] = {
            amount,
            symbol: metaDataMap.get(coinType)?.symbol,
            name: metaDataMap.get(coinType)?.name,
            coinType: coinType,
            icon: metaDataMap.get(coinType)?.iconUrl
          };
        }
      }
    }
    const nftData: { name: string, coinType: string, icon?: string, oid: string }[] = [];
    for (let nft of nfts) {
      if (!hasKey(nft, "type") || !hasKey(nft, "fields")) continue;
      nftData.push({
        name: nft?.fields?.name?.toString() || "Unknow",
        coinType: nft.type, icon: nft.fields.url?.toString(),
        oid: (nft.fields.id as any)?.id?.toString() || ""
      })

    }

    res.json({
      suiBalance,
      tokens: Object.values(tokenData),
      nfts: nftData
    });
  } catch (error) {
    console.error("Error fetching wallet info:", error);
    res.status(500).json({ error: "Failed to fetch wallet information" });
  }
};

export const getObjectInfo = async (req: Request, res: Response) => {
}