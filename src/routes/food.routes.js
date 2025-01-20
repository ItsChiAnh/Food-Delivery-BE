import express from "express";
import {
  addFood,
  editFood,
  findFoodByID,
  listFood,
  removeFood,
} from "../controllers/food.controllers.js";
import upload from "../middleware/multer.js";

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);

foodRouter.get("/list", listFood);

foodRouter.post("/remove", removeFood);

foodRouter.put("/edit/:id", upload.single("image"), editFood);

foodRouter.post("/findid", findFoodByID);

export default foodRouter;
