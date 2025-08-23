import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { apiUrl } from "../config";
interface TestnetObject {
  admin: string;
  id: string;
  balance: string;
}

function TestnetObjectViewer() {
  const [objectData, setObjectData] = useState<TestnetObject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObject = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TestnetObject>(
          apiUrl + "/api/testnet-object"
        );
        setObjectData(response.data);
      } catch (err) {
        setError("Failed to fetch Testnet object data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, []);

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Testnet Object Viewer
      </Typography>
      <Card>
        <CardContent>
          {loading && <CircularProgress />}
          {error && <Typography color="error">{error}</Typography>}
          {objectData && (
            <Box>
              <Typography>
                <strong>Admin:</strong> {objectData.admin}
              </Typography>
              <Typography>
                <strong>ID:</strong> {objectData.id}
              </Typography>
              <Typography>
                <strong>Balance:</strong> {objectData.balance}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default TestnetObjectViewer;
