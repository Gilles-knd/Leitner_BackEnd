import express from "express";
import { PrismaClient } from "@prisma/client";
import { initRoutes } from "./infrastructure/routes";
import cors from"cors";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 8080;



// Middleware
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Routes
initRoutes(app);

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
