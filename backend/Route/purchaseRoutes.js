import express from "express";

import authMiddleware from "../Middleware/authMiddleware.js";
import {
  showInterest,
  deleteInterest,
  getMyInterests,
} from "../Controller/InterestController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/:productId", showInterest);
router.get("/my-purchases", getMyInterests);
router.delete("/:interestId", deleteInterest);

export default router;
