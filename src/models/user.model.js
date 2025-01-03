import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      require: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    role: {
      type: String,
    },
    cartData: {
      type: Object,
      default: {},
    },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
