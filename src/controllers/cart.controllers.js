import UserModel from "../models/user.model.js";

const addToCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.body.userId);
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
    }
  } catch (error) {}
};

export { addToCart };
