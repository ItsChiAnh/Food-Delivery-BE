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
    },
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", userSchema);

export default UserModel;
