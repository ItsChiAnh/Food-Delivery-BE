import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/index.js";
import connectDatabase from "./src/db/db.js";
dotenv.config();
const app = express();
connectDatabase();

app.use(cors());
app.use(express.json());

app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});
app.listen(process.env.PORT, () => {
  console.log(`server is running on http://localhost:${process.env.PORT}`);
});
