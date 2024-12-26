import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDatabase from "./src/db/db.js";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import connectCloudinary from "./src/db/cloudinary.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json());
app.use(cors());

//connect databae
connectDatabase();
//connect cloudinary
connectCloudinary();
//api endpoints
app.use("/api", router);
app.use("/images", express.static("uploads"));

app.get("/", (req, res) => res.send("API Working properly"));

app.listen(port, () => console.log(`Server running on port: ${port}`));
