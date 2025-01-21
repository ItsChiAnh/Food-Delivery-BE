import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { v2 as cloudinary } from "cloudinary";

import rfTokenModel from "../models/refreshtoken.model.js";
import UserModel from "../models/user.model.js";

dotenv.config();
const saltRounds = 10;

const register = async (req, res) => {
  const { userName, email, password, role } = req.body;

  if (!userName || !email || !password) {
    return res.status(404).json({
      message: "Missing credentials",
    });
  }

  let userRole = role && role === "admin" ? "admin" : "user";

  //kiem tra email ton tai
  const checkExistingUser = await UserModel.findOne({ email: email });
  if (checkExistingUser) {
    return res.status(409).json({
      Message: "Email already exists",
    });
  }
  //ma hoa mat khau
  bcrypt.hash(password, saltRounds, async function (err, hashedPassword) {
    if (err) res.send("loi ", err.message);

    const newUser = new UserModel({
      userName,
      email,
      // avatar: imageUpload.secure_url,
      password: hashedPassword,
      role: userRole,
      cartData: [],
      otp: "",
      otpExpires: "",
    });
    const insertNewUser = await newUser.save();

    if (!insertNewUser) {
      return res.status(500).json({
        error: "failed to create user",
      });
    }
    res.status(200).json({
      message: "user created successfully",
      user: insertNewUser,
    });
  });
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra thông tin đầu vào
    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    // Tìm người dùng qua email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Tạo payload cho JWT
    const payload = {
      id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
      cartData: user.cartData,
    };

    // Tạo Access Token
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h", // Thời gian sống Access Token
      algorithm: "HS256",
    });

    // Tạo Refresh Token
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d", // Thời gian sống Refresh Token
      algorithm: "HS256",
    });

    // Lưu Refresh Token (có thể hash trước khi lưu)
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);
    await rfTokenModel.create({
      token: hashedRefreshToken,
      userId: user._id,
    });

    // Phản hồi đăng nhập thành công
    res.status(200).json({
      message: "Login successfully",
      userinfo: payload,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      token_expiry: {
        access_token_expiry: "1h",
        refresh_token_expiry: "1d",
      },
    });
  } catch (error) {
    console.error(" server error:", error);
    res.status(500).json({ error: " server error" + error.message });
  }
};

const getRefToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(403).json({
      message: "cannot get refresh token",
    });
  }
  //kiem tra ref token trong db
  const storedToken = await rfTokenModel.findOne({ token: refreshToken });
  if (storedToken) {
    res.status(403).json({
      message: "token not exists",
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "error",
        err,
      });
    }
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "20m",
    });
    res.status(201).json({
      data: accessToken,
    });
  });
};
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({
      message: "Error",
    });
  }

  //xoa token khoi db
  await rfTokenModel.deleteOne({ token: refreshToken });
  res.json({
    message: "Logout successfully",
  });
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json({ message: "missing email" });
    }

    const _user = await UserModel.findOne({ email });
    if (!_user) {
      return res.status(404).json({ message: "User is not found" });
    }

    // Tạo OTP ngẫu nhiên (6 chữ số)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Lưu OTP và thời gian hết hạn
    _user.otp = otp;
    _user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 phút
    await _user.save();

    // Cấu hình gửi email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // hoặc SMTP khác
      auth: {
        user: process.env.EMAIL_USERNAME, // email của bạn
        pass: process.env.EMAIL_PASSWORD, // mật khẩu ứng dụng
      },
    });

    // Nội dung email
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Here is your OTP to change password",
      text: `Your OTP is: ${otp}. This OTP will be expired in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Send OTP successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error: " + error.message });
  }
};

const changePasswordWithOtp = async (req, res) => {
  const { email, otp, newPass } = req.body;
  try {
    if (!email || !otp || !newPass) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const _user = await UserModel.findOne({ email });
    if (!_user) {
      return res.status(404).json({ message: "User is not found" });
    }

    // Kiểm tra OTP và thời gian hết hạn
    if (_user.otp !== otp || _user.otpExpires < Date.now()) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // Mã hóa mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPass, 10);
    _user.password = hashedPassword;

    // Xóa OTP sau khi sử dụng
    _user.otp = null;
    _user.otpExpires = null;

    await _user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: " server error: " + error.message });
  }
};

// change password after logged in
const changePassword = async (req, res) => {
  const { userId, oldPass, newPass } = req.body;
  if (!userId || !oldPass || !newPass)
    return res.status(400).json({
      message: "Missing credentials",
    });
  const _user = await UserModel.findById(userId);
  if (oldPass != _user.password)
    return res.status(404).json({
      message: "Invalid password",
    });
  _user.password = newPass;
  await _user.save();

  return res.status(200).json({
    message: "Password changed successfully!",
  });
};
//
const changeInfo = async (req, res) => {
  try {
    const { userId, newName } = req.body;
    const imageFile = req.file;
    if (!userId)
      return res.status(404).json({
        message: "missing credentials",
      });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const _user = await UserModel.findById(userId);
    if (!_user) return res.status(404).json({ message: "User is not found" });
    if (newName && typeof newName === "string" && newName.trim().length > 0) {
      _user.userName = newName.trim();
    }

    _user.avatar = imageUpload.secure_url;

    await _user.save();

    return res.status(200).json({
      message: "user informations changed successfully!",
      updatedUser: {
        id: _user._id,
        userName: _user.userName,
        avatar: _user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Loi server " + error.message,
    });
  }
};
const userController = {
  register,
  login,
  logout,
  getRefToken,
  sendOtp,
  changePasswordWithOtp,
  changePassword,
  changeInfo,
};
export default userController;
