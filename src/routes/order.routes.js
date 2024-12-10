import express from "express";
import { addOrder, removeOrder } from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/add", addOrder);

orderRouter.post("/remove", removeOrder);

export default orderRouter;
