import express from "express";
import { initRoutes } from "./infrastructure/routes.ts";
import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";

config();

const main = async () => {
  const app = express();
  const port = Number(process.env.PORT);

  //Log
  if (process.env.NODE_ENV == "development") {
    app.use(morgan("dev"));
  } else {
    app.use(morgan("combined"));
  }

  try {
    console.log("Datasource initialized");
  } catch (error) {
    console.log(error);
    console.error("Cannot contact database.");
    process.exit(1);
  }
  app.use(cors());
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    app.use(express.json({ limit: "50mb" }));
    initRoutes(app);
  });
};

main().catch(async (e) => {
  console.error(e);
  process.exit(1);
});
