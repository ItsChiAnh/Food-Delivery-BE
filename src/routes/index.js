import { Router } from "express";
import userRouter from "./user.route.js";
import foodRouter from "./food.routes.js";

import userRouter from "./user.routes.js";
const router = Router();

router.use("/auth", userRouter);

router.use("/food", foodRouter);

export default router;
