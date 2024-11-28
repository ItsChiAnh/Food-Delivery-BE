import { Router } from "express";
import userRouter from "./user.route.js";
const router = Router();
router.use("/auth", userRouter);
export default router;
