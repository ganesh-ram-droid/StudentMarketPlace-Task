import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    status: {
      type: String,
      enum: ["interested", "cancelled"],
      default: "interested",
    },
  },
  {
    timestamps: true,
  }
);

interestSchema.index({ buyer: 1, product: 1 }, { unique: true });


const Interest = mongoose.model("Interest", interestSchema, "purchases");

export default Interest;
