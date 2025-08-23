import {
  ConnectButton,
  useCurrentAccount,
  useSuiClient,
  useSuiClientContext,
} from "@mysten/dapp-kit";
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

interface WalletCardProps {
  activeNetwork: string;
}

function WalletCard({ activeNetwork }: WalletCardProps) {
  const account = useCurrentAccount();
  const ctx = useSuiClientContext();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setLoading(true);
      suiClient
        .getBalance({ owner: account.address })
        .then((res) => {
          const suiBalance = Number(res.totalBalance) / 1_000_000_000;
          setBalance(suiBalance.toLocaleString());
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching balance:", err);
          setLoading(false);
        });
    } else {
      setBalance(null);
    }
  }, [account, suiClient, activeNetwork]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <Card sx={{ borderLeft: 4, borderColor: "primary.main" }}>
        <CardContent sx={{ p: 3 }}>
          <ConnectButton />
          {account ? (
            <Box mt={2}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {account.address}
              </Typography>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                {loading ? (
                  <CircularProgress size={14} sx={{ ml: 1 }} />
                ) : balance !== null ? (
                  ` ${balance} SUI`
                ) : (
                  " N/A"
                )}{" "}
                SUI
              </Typography>
              <InputLabel id="network-select-label">Network</InputLabel>
              <Select
                labelId="network-select-label"
                id="network-select"
                value={activeNetwork}
                label="Network"
                onChange={(e) => ctx.selectNetwork(e.target.value)}
              >
                {Object.keys(ctx.networks).map((network) => (
                  <MenuItem key={network} value={network}>
                    {network.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          ) : (
            <Typography variant="body2" mt={"20px"}>
              Please connect your wallet to view information.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default WalletCard;
