import express from "express";
import { placeOrder, removeOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/add", placeOrder);

orderRouter.post("/remove", removeOrder);

export default orderRouter;
