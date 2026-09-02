import mongoose from "mongoose";
import Product from "../Model/Product.js";
import Purchase from "../Model/Purchase.js";

export const buyProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.status === "sold") {
      return res.status(400).json({
        message: "This product has already been sold",
      });
    }

    if (product.seller.toString() === req.user) {
      return res.status(400).json({
        message: "You cannot buy your own product",
      });
    }

    const existingPurchase = await Purchase.findOne({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    if (existingPurchase) {
      return res.status(409).json({
        message: "You have already bought this product",
        purchase: existingPurchase,
      });
    }

    const purchase = await Purchase.create({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    res.status(201).json({
      message: "Product bought successfully",
      purchase,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already bought this product",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const checkProductPurchase = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const purchase = await Purchase.findOne({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    res.status(200).json({
      hasBought: Boolean(purchase),
      purchase: purchase || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({
      buyer: req.user,
      status: "completed",
    })
      .populate({
        path: "product",
        populate: {
          path: "seller",
          select: "name phone",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      purchases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deletePurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
      return res.status(400).json({
        message: "Invalid purchase id",
      });
    }

    const purchase = await Purchase.findOne({
      _id: purchaseId,
      buyer: req.user,
    });

    if (!purchase) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await purchase.deleteOne();

    res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
