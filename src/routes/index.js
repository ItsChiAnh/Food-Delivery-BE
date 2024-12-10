import { Router } from "express";
import userRouter from "./user.routes.js";
import foodRouter from "./food.routes.js";
import orderRouter from "./order.routes.js";

const router = Router();

router.use("/auth", userRouter);

router.use("/food", foodRouter);

router.use("/order", orderRouter);

export default router;
