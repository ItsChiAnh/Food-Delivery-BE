import express from "express";
import {
  addCoupon,
  findCoupon,
  listCoupon,
  removeCoupon,
} from "../controllers/coupon.controllers.js";
const couponRouter = express.Router();

couponRouter.post("/add", addCoupon);

couponRouter.post("/remove", removeCoupon);

couponRouter.get("/list", listCoupon);

couponRouter.post("/find-coupon", findCoupon);

export default couponRouter;
