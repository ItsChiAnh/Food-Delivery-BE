import foodModel from "../models/food.models.js";
import { v2 as cloudinary } from "cloudinary";

const addFood = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const imageFile = req.file;
    const category = req.body.category;

    if (!name || !price || !category || !imageFile) {
      return res.status(404).json({ message: "Missing properties!" });
    }
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const foodData = {
      name,
      description,
      price,
      image: imageUpload.secure_url,
      category,
    };

    const food = foodModel(foodData);
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

    // food.name = req.body.name || food.name;
    // food.description = req.body.description || food.description;
    // food.price = req.body.price || food.price;
    // food.category = req.body.category || food.category;
    const updatedData = {
      name: req.body.name || food.name,
      description: req.body.description || food.description,
      price: req.body.price || food.price,
      category: req.body.category || food.category,
    };

    // Update image if a new one is uploaded
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      console.log("Cloudinary upload response:", imageUpload);
      updatedData.image = imageUpload.secure_url;
    }

    // Save the updated food document
    await food.updateOne(updatedData);
    return res.status(200).json({ success: true, message: "Food updated!" });
  } catch (error) {
    console.error("Error updating food:", error);
    return res.status(400).json({ message: "Error updating food!" });
  }
};

export { addFood, listFood, removeFood, editFood, findFoodByID };
