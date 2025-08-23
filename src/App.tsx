import { useState, useEffect } from "react";
import {
  SuiClientProvider,
  WalletProvider,
  useCurrentWallet,
  createNetworkConfig,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui.js/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Box, Container, Typography, Tabs, Tab } from "@mui/material";
import WalletCard from "./components/WalletCard";
import AddressExplorer from "./components/AddressExplorer";
import TestnetObjectViewer from "./components/TestnetObjectViewer";
import TransactionSender from "./components/TransactionSender";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3, width: "100%", minWidth: "600px" }}>{children}</Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export function App() {
  const [activeNetwork, setActiveNetwork] = useState(
    "testnet" as keyof typeof networkConfig
  );
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork={activeNetwork}
        onNetworkChange={(network) => {
          console.log(network);
          setActiveNetwork(network);
        }}
      >
        <WalletProvider autoConnect={true}>
          <Container maxWidth="md">
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

              <WalletCard activeNetwork={activeNetwork} />

              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  width: "100%",
                  mt: 3,
                }}
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="basic tabs example"
                  centered
                >
                  <Tab label="Address Explorer" {...a11yProps(0)} />
                  <Tab label="Testnet Object" {...a11yProps(1)} />
                  <Tab label="Send SUI (Testnet)" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={tabValue} index={0}>
                <AddressExplorer />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <TestnetObjectViewer />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <TransactionSender />
              </TabPanel>
            </Box>
          </Container>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
