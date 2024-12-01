import mongoose from "mongoose";
const rfTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String,

      expires: "1d",
    },
  },
  { timestamps: true }
);
const rfTokenModel = mongoose.model("RefreshToken", rfTokenSchema);

export default rfTokenModel;
