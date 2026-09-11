import express from "express";

import authMiddleware from "../Middleware/authMiddleware.js";
import upload from "../Middleware/uploadMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  getProductById,
  getProducts,
  markProductAsSold,
  updateProduct,
} from "../Controller/ProductController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/my-products", authMiddleware, getMyProducts);
router.get("/:id", authMiddleware, getProductById);

router.post("/", authMiddleware, upload.single("image"), createProduct);
router.put("/:id", authMiddleware, upload.single("image"), updateProduct);
router.patch("/:id/sold", authMiddleware, markProductAsSold);
router.delete("/:id", authMiddleware, deleteProduct);

export default router;
