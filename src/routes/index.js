import { Router } from "express";
import userRouter from "./user.routes.js";
import foodRouter from "./food.routes.js";
import orderRouter from "./order.routes.js";
import cartRouter from "./cart.routes.js";
import couponRouter from "./coupon.routes.js";

const router = Router();

router.use("/auth", userRouter);

router.use("/food", foodRouter);

router.use("/cart", cartRouter);

router.use("/order", orderRouter);

router.use("/coupon", couponRouter);

export default router;
