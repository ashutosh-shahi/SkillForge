const User = require("../models/User");

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const {
      bio,
      skills,
      avatar,
      education,
      projects,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        bio,
        skills,
        avatar,
        education,
        projects,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};