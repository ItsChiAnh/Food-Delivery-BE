import express from "express";
import { placeOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/add", placeOrder);

orderRouter.post("/remove");

export default orderRouter;
