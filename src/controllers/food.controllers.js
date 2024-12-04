import foodModel from "../models/food.models.js";
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
    const foodId = req.body.id;
    const food = await foodModel.findById(foodId);
    console.log(foodId);
    fs.unlink(`uploads/${food.image}`, () => {});

    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error!" });
  }
};

const findFoodByID = async (req, res) => {
  try {
    const foodId = req.body.id;
    const food = await foodModel.findById(foodId);
    console.log(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    return res.json(food); // Return the found food object
  } catch (error) {
    console.error("Error finding food:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const editFood = async (req, res) => {
  try {
    const foodId = req.params.id || req.body.id; // Check for ID in both params and body (adjust based on your API design)
    const food = await foodModel.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food not found!" });
    }

    // Update food properties (handle optional data)

    food.name = req.body.name || food.name;
    food.description = req.body.description || food.description;
    food.price = req.body.price || food.price;
    food.category = req.body.category || food.category;

    // Update image if a new one is uploaded
    if (req.file) {
      food.image = `${req.file.filename}`;

      // Implement logic to delete the old image file (if applicable)
    }

    // Save the updated food document
    await food.save();
    return res.status(200).json({ success: true, message: "Food updated!" });
  } catch (error) {
    console.error("Error updating food:", error);
    return res.status(400).json({ message: "Error updating food!" });
  }
};

export { addFood, listFood, removeFood, editFood, findFoodByID };
