import couponModel from "../models/coupon.models.js";

const addCoupon = async (req, res) => {
  try {
    const { couponCode, couponName, description, discount, expiredDate } =
      req.body;
    if (!couponCode || !couponName || !discount) {
      return res.status(404).json({
        success: false,
        message: "missing credentials",
      });
    }
    const couponIsExists = await couponModel.findOne({ couponCode });
    if (couponIsExists)
      return res.json({ success: false, message: "coupon already exists" });
    const couponData = {
      couponCode,
      couponName,
      description,
      discount,
      expiredDate,
    };
    const coupon = couponModel(couponData);
    await coupon.save();
    res.status(200).json({
      success: true,
      message: "Coupon added!",
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "Error! " + error.message });
  }
};

const listCoupon = async (req, res) => {
  try {
    const allCoupon = await couponModel.find({});
    res.status(200).json({ success: true, data: allCoupon });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error fetching data!" });
  }
};

const removeCoupon = async (req, res) => {
  try {
    const couponId = req.body.id;
    const coupon = await couponModel.findById(couponId);

    await couponModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error!" });
  }
};

const findCoupon = async (req, res) => {
  try {
    const couponCode = req.body;
    const coupon = await couponModel.findOne(couponCode);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    return res.json(coupon);
  } catch (error) {
    console.error("Error finding coupon:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export { addCoupon, listCoupon, removeCoupon, findCoupon };
