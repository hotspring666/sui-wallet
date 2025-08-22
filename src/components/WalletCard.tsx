import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';


function WalletCard() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setLoading(true);
      suiClient.getBalance({ owner: account.address })
        .then(res => {
          const suiBalance = Number(res.totalBalance) / 1_000_000_000;
          setBalance(suiBalance.toLocaleString());
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching balance:', err);
          setLoading(false);
        });
    } else {
      setBalance(null);
    }
  }, [account, suiClient]);

  return (
    <Card sx={{ minWidth: 275, mt: 3, width: '100%' }}>
      <CardContent>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Wallet Information
        </Typography>
        {account ? (
          <Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Address:</strong> {account.address}
            </Typography>
            <Typography variant="body2">
              <strong>SUI Balance:</strong>
              {loading ? <CircularProgress size={14} sx={{ ml: 1 }} /> : balance !== null ? ` ${balance} SUI` : ' N/A'}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2">
            Please connect your wallet to view information.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default WalletCard;
