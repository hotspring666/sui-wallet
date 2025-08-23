import { isValidSuiAddress } from "@mysten/sui/utils";
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
  Grid,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { Search, Token, Image, ContentCopy } from "@mui/icons-material";
import { apiUrl } from "../config";
interface Token {
  amount: number;
  name: string;
  symbol: string;
  coinType: string;
  icon: string;
}

interface NFT {
  name: string;
  coinType: string;
  icon: string;
  oid: string;
}

interface WalletInfo {
  suiBalance: number;
  tokens: Token[];
  nfts: NFT[];
}

function AddressExplorer() {
  const [address, setAddress] = useState("");
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    if (!isValidSuiAddress(address)) {
      setError(
        "Invalid Sui address. Please enter a valid address starting with 0x."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setWalletInfo(null);

    try {
      const response = await axios.get<WalletInfo>(
        apiUrl + `/api/wallet-info/${address}`
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Maybe show a small notification/toast that copy was successful
    });
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search Section */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <TextField
          fullWidth
          label="Enter Sui Wallet Address"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
        />
        <IconButton
          onClick={handleFetch}
          disabled={!address || loading}
          size="large"
          sx={{ px: 4 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <Search />
          )}
        </IconButton>
      </Box>

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Wallet Info Display */}
      {walletInfo && (
        <Grid container spacing={3}>
          {/* Balance Overview */}
          <Grid size={12}>
            <Card sx={{ borderLeft: 4, borderColor: "primary.main" }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Wallet: {formatAddress(address)}
                  <Tooltip title="Copy Full Address">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(address)}
                      sx={{ ml: 1 }}
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {walletInfo.suiBalance.toLocaleString()} SUI
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Tokens Section */}
          <Grid size={12}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Tokens ({walletInfo.tokens.length})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mt: 2,
                  }}
                >
                  {walletInfo.tokens.length > 0 ? (
                    walletInfo.tokens.map((token) => (
                      <Paper
                        key={token.coinType}
                        variant="outlined"
                        sx={{
                          p: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar src={token.icon}>
                          <Token />
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {token.symbol}
                          </Typography>
                          <Tooltip title={token.coinType}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {token.name}
                            </Typography>
                          </Tooltip>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {token.amount.toLocaleString()}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography
                      color="text.secondary"
                      sx={{ textAlign: "center", py: 4 }}
                    >
                      No other tokens found.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* NFTs Section */}
          <Grid size={12}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  NFTs ({walletInfo.nfts.length})
                </Typography>
                {walletInfo.nfts.length > 0 ? (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {walletInfo.nfts.map((nft, index) => (
                      <Grid size={4} key={index}>
                        <Paper variant="outlined">
                          <Tooltip title={`${nft.name} (${nft.oid})`}>
                            <Box>
                              <Avatar
                                src={nft.icon}
                                variant="rounded"
                                sx={{ width: "100%", height: 140, mb: 1 }}
                              >
                                <Image sx={{ fontSize: 40 }} />
                              </Avatar>
                              <Typography
                                variant="subtitle2"
                                noWrap
                                sx={{ p: 1, textAlign: "center" }}
                              >
                                {nft.name}
                              </Typography>
                            </Box>
                          </Tooltip>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 4 }}
                  >
                    No NFTs found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default AddressExplorer;
