import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cart.controllers.js";
import authorizationToken from "../middleware/auth.mdw.js";
import authMiddleware from "../middleware/auth.middeware.js";

const cartRouter = express.Router();

cartRouter.post("/add", authorizationToken, addToCart);

cartRouter.post("/remove", authorizationToken, removeFromCart);

cartRouter.get("/get", authorizationToken, getCart);

export default cartRouter;
