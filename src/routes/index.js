import { Router } from "express";
import foodRouter from "./food.routes.js";

const router = Router();
router.use("/food", foodRouter);

export default router;
