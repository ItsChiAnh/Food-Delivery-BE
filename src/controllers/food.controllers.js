import foodModel from "../models/foodModels.js";
import fs from "fs";

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    image: image_filename,
    category: req.body.category,
  });
  try {
    await food.save();
    res.status(200).json({ success: true, message: "Food added!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error!" });
  }
};

const listFood = async (req, res) => {
  try {
    const allFood = await foodModel.find({});
    res.status(200).json({ success: true, data: allFood });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error fetching data!" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error!" });
  }
};

export { addFood, listFood, removeFood };
