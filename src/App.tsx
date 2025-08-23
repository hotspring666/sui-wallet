import { useState } from "react";
import {
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Container, Typography } from "@mui/material";
import WalletCard from "./components/WalletCard";
import AddressExplorer from "./components/AddressExplorer";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();
const networks = {
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
};

function App() {
  const [activeNetwork, setActiveNetwork] = useState(
    "mainnet" as keyof typeof networks
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networks}
        network={activeNetwork}
        onNetworkChange={(network) => {
          setActiveNetwork(network);
        }}
      >
        <WalletProvider>
          <Container maxWidth="sm">
            <Box
              sx={{
                my: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                Sui Wallet
              </Typography>

              <WalletCard />
              <AddressExplorer />
            </Box>
          </Container>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default App;
