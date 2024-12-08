import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  cartItemPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const cartItemModel =
  mongoose.models.cartItem || mongoose.model("cartItem", cartItemSchema);

export default cartItemModel;
