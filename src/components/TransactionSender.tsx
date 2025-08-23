import { isValidSuiAddress } from "@mysten/sui/utils";
import { useState } from "react";
import {
  useSignAndExecuteTransaction,
  useCurrentAccount,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Link,
  Card,
  CardContent,
} from "@mui/material";

function TransactionSender() {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecuteTransaction, isPending: isSendPending } =
    useSignAndExecuteTransaction();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [txDigest, setTxDigest] = useState("");
  const [error, setError] = useState("");
  const [faucetMessage, setFaucetMessage] = useState("");

  const handleSend = () => {
    if (!currentAccount) {
      setError("Please connect your wallet first.");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Invalid amount.");
      return;
    }

    if (!isValidSuiAddress(recipient)) {
      setError(
        "Invalid recipient address. Please enter a valid Sui address starting with 0x."
      );
      return;
    }

    setError("");
    setTxDigest("");
    setFaucetMessage("");

    // 使用新的 Transaction 類別而不是 TransactionBlock
    const txb = new Transaction();

    // 將 SUI 金額轉換為 MIST (1 SUI = 1,000,000,000 MIST)
    const amountInMist = Math.floor(parsedAmount * 1_000_000_000);

    const [coin] = txb.splitCoins(txb.gas, [amountInMist]);
    txb.transferObjects([coin], recipient);

    signAndExecuteTransaction(
      {
        transaction: txb,
        chain: "sui:testnet",
      },
      {
        onSuccess: (result) => {
          console.log("Transaction successful:", result);
          setAmount("");
          setRecipient("");
          setError("");
          setTxDigest(result.digest);
        },
        onError: (err) => {
          console.error("Transaction error:", err);
          setError(err.message || "Transaction failed");
        },
      }
    );
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Send SUI (Testnet)
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <TextField
              label="Recipient Address"
              variant="outlined"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={!currentAccount || isSendPending}
            />
            <TextField
              label="Amount (SUI)"
              type="number"
              variant="outlined"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!currentAccount || isSendPending}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleSend}
                disabled={
                  !currentAccount || isSendPending || !recipient || !amount
                }
                sx={{ position: "relative", flexGrow: 1, py: 1.5 }}
              >
                {isSendPending ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: "white", position: "absolute" }}
                  />
                ) : (
                  "Send"
                )}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            {faucetMessage && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {faucetMessage}
              </Alert>
            )}
            {txDigest && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Transaction Successful! Digest:
                <Link
                  href={`https://testnet.suivision.xyz/txblock/${txDigest}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ ml: 1, wordBreak: "break-all" }}
                >
                  {txDigest}
                </Link>
              </Alert>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TransactionSender;
