import UserModel from "../models/user.model.js";

const addToCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.user.id);
    let cartData = await userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1; //create new if the cart is empty
    } else {
      cartData[req.body.itemId] += 1; //increase 1 item if the cart is not empty
    }

    //old code
    // await UserModel.findByIdAndUpdate(req.user.id, { cartData });

    //fix cartData
    await UserModel.findByIdAndUpdate(req.user.id, {
      cartData: { ...cartData },
    });

    console.log(cartData);
    res.status(200).json({ success: true, message: "Added to cart!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error!" + error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.user.id);
    let cartData = await userData.cartData;

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    await UserModel.findByIdAndUpdate(req.user.id, { cartData });
    console.log(cartData);
    res.status(200).json({ success: true, message: "Removed!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error!" });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await UserModel.findById(req.user.id);
    let userName = userData.userName;
    let cartData = await userData.cartData;

    res.status(200).json({ success: true, userName, cartData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error!" });
  }
};
export { addToCart, removeFromCart, getCart };
