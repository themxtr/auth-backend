import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://auth-frontend-ten-iota.vercel.app/"
  ]
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// Health Check
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Server running properly" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
