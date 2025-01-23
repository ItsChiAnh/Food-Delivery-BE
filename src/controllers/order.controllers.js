import orderModel from "../models/order.models.js";
import UserModel from "../models/user.model.js";
import Stripe from "stripe";
import { v2 as cloudinary } from "cloudinary";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = "https://food-delivery-fe-raqc.onrender.com";

  try {
    const newOrder = new orderModel({
      userId: req.user.id,
      items: req.body.item,
      amount: req.body.amount,
      address: req.body.address,
      // //them image
      // imageFile: req.body.image[0],
    });
    console.log(newOrder);
    await newOrder.save();
    await UserModel.findByIdAndUpdate(req.user.id, { cartData: {} }); //clear userCart when order is placed
    //
    // const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
    //   resource_type: "image",
    // });
    //
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
      // //
      // image: imageUpload.secure_url,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error!" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true, message: "Paid!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(500).json({ success: false, message: "Not paid!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error Occurred!" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error Occurred" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
