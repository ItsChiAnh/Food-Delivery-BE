import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@web83ls4.dcjca.mongodb.net/FoodDelivery?retryWrites=true&w=majority&appName=web83ls4`;

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_CONNECTION);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("failed to connect to the database", error);
    process.exit(1);
  }
};

export default connectDatabase;
