import { useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

interface Token {
  amount: number;
  coinType: string;
}

interface WalletInfo {
  suiBalance: number;
  tokens: Token[];
}

function AddressExplorer() {
  const [address, setAddress] = useState("");
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setWalletInfo(null);

    try {
      const response = await axios.get<WalletInfo>(
        `http://localhost:21667/api/wallet-info/${address}`
      );
      setWalletInfo(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.error || "An error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Address Explorer
      </Typography>
      <Box sx={{ display: "flex", mb: 2 }}>
        <TextField
          fullWidth
          label="Enter Sui Wallet Address"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleFetch}
          sx={{ ml: 2, whiteSpace: "nowrap" }}
        >
          Search
        </Button>
      </Box>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      {walletInfo && (
        <Card>
          <CardContent>
            <Typography variant="h6">Wallet Details</Typography>
            <Typography>
              <strong>SUI Balance:</strong>{" "}
              {walletInfo.suiBalance.toLocaleString()} SUI
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography>
              <strong>Tokens:</strong>
            </Typography>
            {walletInfo.tokens.length > 0 ? (
              <List dense>
                {walletInfo.tokens.map((token) => (
                  <ListItem key={token.coinType}>
                    <ListItemText
                      primary={token.coinType.split("::").slice(-1)[0]}
                      secondary={`${token.amount.toLocaleString()} - ${
                        token.coinType
                      }`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No other tokens found.</Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default AddressExplorer;
