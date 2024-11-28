import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import rfTokenModel from "../models/refreshtoken.model.js";
dotenv.config();
const saltRounds = 10;

const register = async (req, res) => {
  const { userName, email, password } = req.body;
  if (!userName || !email || !age || !avatar || !password) {
    return res.status(404).json({
      message: "Thieu thong tin",
    });
  }
  let userRole = role && role === "admin" ? "admin" : "user";

  //kiem tra email ton tai
  const checkExistingUser = await UserModel.findOne({ email: email });
  console.log(password);
  if (checkExistingUser) {
    return res.status(409).json({
      Message: "Email already exists",
    });
  }
  //ma hoa mat khau
  bcrypt.hash(password, saltRounds, async function (err, hashedPassword) {
    if (err) res.send("loi ", err.message);
    const newUser = {
      userName,
      email,
      age,
      avatar,
      password: hashedPassword,
      role: userRole,
    };
    const insertNewUser = await UserModel.create(newUser);
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

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const payload = {
      id: user._id,
      email: user.email,
      userName: user.userName,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    await rfTokenModel.create({
      token: refreshToken,
      userId: user._id,
    });

    res.status(200).json({
      message: "Login successfully",
      userinfo: payload,
      access_token: token,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error",
    });
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
const userController = { register, login, logout, getRefToken };
export default userController;
