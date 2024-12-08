import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  cartItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cartItem",
    },
  ],
  total: {
    type: Number,
    required: true,
  },
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
