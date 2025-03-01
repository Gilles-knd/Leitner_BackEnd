import express from "express";
import { PrismaClient } from "@prisma/client";
import { initRoutes } from "./infrastructure/routes";
import cors from"cors";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
initRoutes(app);

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",

  credentials: true,
}));

// Healthcheck
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle shutdown correctly
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
