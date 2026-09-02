import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_DB;

    if (!mongoUri) {
      throw new Error("MONGO_URI or MONGO_DB is not defined in .env");
    }

    await mongoose.connect(mongoUri);
    console.log("DB Connected");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};