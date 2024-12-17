import { Router } from "express";
import userRouter from "./user.routes.js";
import foodRouter from "./food.routes.js";
import orderRouter from "./order.routes.js";
import cartRouter from "./cart.routes.js";

const router = Router();

router.use("/auth", userRouter);

router.use("/food", foodRouter);

router.use("/order", orderRouter);

router.use("/cart", cartRouter);

export default router;
