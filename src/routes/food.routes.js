import express from "express";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/food.controllers.js";
import upload from "../middleware/multer.js";

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

export default foodRouter;
