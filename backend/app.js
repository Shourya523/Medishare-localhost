import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import { ethers } from "ethers";

import userRoute from "./routes/user.routes.js";
import blockChainRoute from "./routes/blockchain.routes.js";
import medicineRoute from "./routes/medicine.routes.js";
import manufactureRoute from "./manufacturerService/controller/manufcturer.controller.js";

dotenv.config();

// Load ABI
const medishareABI = JSON.parse(
  fs.readFileSync("./abi/medishareABI.json", "utf-8")
);

// Blockchain Config
const API_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Provider
const provider = new ethers.JsonRpcProvider(API_URL, {
  name: "localhost",
  chainId: 31337,
  ensAddress: null,
});

// Signer
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract Instance
export const contractInstance = new ethers.Contract(
  CONTRACT_ADDRESS,
  medishareABI,
  signer
);

// Express App
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Routes
app.use("/users", userRoute);
app.use("/chain", blockChainRoute);
app.use("/ecommerce", medicineRoute);
app.use("/manufacturer", manufactureRoute);

export default app;
