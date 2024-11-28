import { Router } from "express";
import userController from "../controller/user.controller.js";
const userRouter = Router();
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/token", userController.getRefToken);
userRouter.post("/logout", userController.logout);
export default userRouter;
