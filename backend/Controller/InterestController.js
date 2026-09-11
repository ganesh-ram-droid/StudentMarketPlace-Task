import mongoose from "mongoose";
import Product from "../Model/Product.js";
import Purchase from "../Model/Purchase.js";

export const showInterest = async (req, res) => {
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
        message: "You cannot show interest in your own product",
      });
    }

    const existingInterest = await Purchase.findOne({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    if (existingInterest) {
      return res.status(409).json({
        message: "You have already shown interest in this product",
        interest: existingInterest,
      });
    }

    const interest = await Purchase.create({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    res.status(201).json({
      message: "Interest in the product recorded successfully",
      interest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already shown interest in this product",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const checkProductInterest = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        message: "Invalid product id",
      });
    }

    const interest = await Purchase.findOne({
      buyer: req.user,
      product: productId,
      status: "completed",
    });

    res.status(200).json({
      hasShownInterest: Boolean(interest),
      interest: interest || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getMyInterests = async (req, res) => {
  try {
    const interests = await Purchase.find({
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
      interests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        message: "Invalid interest id",
      });
    }

    const interest = await Purchase.findOne({
      _id: interestId,
      buyer: req.user,
    });

    if (!interest) {
      return res.status(404).json({
        message: "Interest not found",
      });
    }

    await interest.deleteOne();

    res.status(200).json({
      message: "Interest removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
