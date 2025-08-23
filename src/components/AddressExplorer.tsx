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
  Chip,
  Paper,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Token,
  Image,
  ContentCopy,
} from "@mui/icons-material";

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-6)}`;
  };

  const formatCoinType = (coinType: string) => {
    return coinType.split("::").slice(-1)[0].split(">")[0];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>

      {/* Search Section */}
      <Card
        elevation={3}
        sx={{
          mb: 4,
          color: "white"
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={10}>
              <TextField
                fullWidth
                label="Enter Sui Wallet Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(0,0,0,0.6)",
                  },
                }}
                placeholder="0x..."
              />
            </Grid>
            <Grid size={2}>
              <IconButton
                onClick={handleFetch}
                disabled={!address || loading}
                size="large"


              >{loading ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWallet />}
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card sx={{ mb: 4, border: "1px solid #f44336" }}>
          <CardContent>
            <Typography color="error" variant="h6">
              Error: {error}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Wallet Info Display */}
      {walletInfo && (
        <Box>
          {/* Balance Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={12}>
              <Card elevation={3} sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <AccountBalanceWallet sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Wallet Address: {formatAddress(address)}
                    <Tooltip title="Copy address">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(address)}
                        sx={{ color: "white", ml: 1 }}
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {walletInfo.suiBalance.toLocaleString()} SUI
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Balance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Tokens and NFTs Grid */}
          <Grid container spacing={3}>
            {/* Tokens Section */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Token sx={{ mr: 2, color: "#2196F3" }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Tokens ({walletInfo.tokens.length})
                    </Typography>
                  </Box>

                  {walletInfo.tokens.length > 0 ? (
                    <Grid container spacing={2}>
                      {walletInfo.tokens.map((token) => (
                        <Grid size={12} key={token.coinType}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                elevation: 3,
                                transform: "translateY(-2px)"
                              }
                            }}
                          >
                            <Box sx={{
                              display: "flex", alignItems: "center",
                              justifyContent: "space-between"
                            }}>
                              <Avatar
                                src={token.icon}
                                sx={{ width: 48, height: 48, mr: 2 }}
                              >
                                <Token />
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Tooltip title={token.coinType}>
                                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {formatCoinType(token.coinType)}
                                  </Typography>
                                </Tooltip>

                              
                              </Box>
                              <Chip
                                  label={`${token.amount.toLocaleString()}`}
                                  color="primary"
                                  size="small"
                                  sx={{ mt: 1 }}
                                />
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Token sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                      <Typography color="text.secondary">
                        No tokens found in this wallet
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* NFTs Section */}
            <Grid size={12}>
              <Card elevation={3} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Image sx={{ mr: 2, color: "#FF6B6B" }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      NFTs ({walletInfo.nfts.length})
                    </Typography>
                  </Box>

                  {walletInfo.nfts.length > 0 ? (
                    <Grid container spacing={2}>
                      {walletInfo.nfts.map((nft, index) => (
                        <Grid size={6} key={index}>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              transition: "all 0.3s ease",
                              "&:hover": {
                                elevation: 3,
                                transform: "translateY(-2px)"
                              }
                            }}
                          >
                            <Tooltip title={nft.oid}>
                              <Box sx={{ textAlign: "center" }}>
                                <Avatar
                                  src={nft.icon}
                                  variant="rounded"
                                  sx={{
                                    width: 80,
                                    height: 80,
                                    mx: "auto",
                                    mb: 2,
                                    border: "2px solid #e0e0e0"
                                  }}
                                >
                                  <Image sx={{ fontSize: 32 }} />
                                </Avatar>

                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
                                  {nft.name}
                                </Typography>


                              </Box>
                            </Tooltip>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Image sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                      <Typography color="text.secondary">
                        No NFTs found in this wallet
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default AddressExplorer;