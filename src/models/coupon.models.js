import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
  },
  couponName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
    required: true,
  },
  expiredDate: {
    type: Date,
  },
});

const couponModel =
  mongoose.models.coupon || mongoose.model("coupon", couponSchema);
export default couponModel;
