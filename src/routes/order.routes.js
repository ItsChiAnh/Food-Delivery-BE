import express from "express";
import authorizationToken from "../middleware/auth.mdw.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authorizationToken, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authorizationToken, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
