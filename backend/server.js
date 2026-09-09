import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./Config/db.js";
import authRoutes from "./Route/authRoutes.js";
import productRoutes from "./Route/productRoutes.js";
import purchaseRoutes from "./Route/purchaseRoutes.js";

dotenv.config();
connectDb();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchases", purchaseRoutes);


app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      message: error.message || "Unable to upload product image",
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
