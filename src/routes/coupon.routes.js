import express from "express";
import {
  addCoupon,
  listCoupon,
  removeCoupon,
  findCouponByID,
} from "../controllers/coupon.controllers.js";
const couponRouter = express.Router();

couponRouter.post("/add", addCoupon);

couponRouter.post("/remove", removeCoupon);

couponRouter.get("/all-coupons", listCoupon);

couponRouter.post("/find-coupon", findCouponByID);

export default couponRouter;
