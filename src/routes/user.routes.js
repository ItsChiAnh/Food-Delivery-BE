import { Router } from "express";
import userController from "../controllers/user.controllers.js";
import upload from "../middleware/multer.js";
const userRouter = Router();
//login - logout
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/token", userController.getRefToken);
userRouter.post("/logout", userController.logout);
// forgot password
userRouter.post("/send-otp", userController.sendOtp);
userRouter.put("/change-password", userController.changePasswordWithOtp);
//change info
userRouter.put("/change-info", userController.changeInfo);
//change password
userRouter.put("/change-password", userController.changePassword);
export default userRouter;
