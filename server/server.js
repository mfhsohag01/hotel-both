import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/db.js";
import ClerkWebhooks from "./controllers/ClerkWebHooks.js";

connectDB();

const app = express();
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Middleware for Clerk
app.use(express.json());
app.use(clerkMiddleware());

// api listen to clerk webhooks
app.use("/api/clerk", ClerkWebhooks);

app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
