import express from "express";
import cors from "cors";
import suiRoutes from "./routes/suiRoutes";

const app = express();
const port = 21667;

app.use(cors());
app.use(express.json());

app.use("/api", suiRoutes);

app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
