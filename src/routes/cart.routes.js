import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controllers.js";
import authorizationToken from "../middleware/auth.mdw.js";

const cartRouter = express.Router();

cartRouter.post("/add", authorizationToken, addToCart);

cartRouter.post("/remove", authorizationToken, removeFromCart);

cartRouter.post("/get", authorizationToken, getCart);

export default cartRouter;
