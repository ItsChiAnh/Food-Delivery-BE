import { Router } from "express";
import userController from "../controllers/user.controllers.js";
const userRouter = Router();
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/token", userController.getRefToken);
userRouter.post("/logout", userController.logout);
userRouter.put("/change-password", userController.changePassword);
userRouter.put("/change-info", userController.changeInfo);
export default userRouter;
