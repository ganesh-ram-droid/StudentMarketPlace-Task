import express from "express";

import authMiddleware from "../Middleware/authMiddleware.js";
import {
  buyProduct,
  checkProductPurchase,
  deletePurchase,
  getMyPurchases,
} from "../Controller/PurchaseController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:productId", buyProduct);
router.get("/check/:productId", checkProductPurchase);
router.get("/my-purchases", getMyPurchases);
router.delete("/:purchaseId", deletePurchase);

export default router;
