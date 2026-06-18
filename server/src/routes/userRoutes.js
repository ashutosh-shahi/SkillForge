const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getPublicProfile,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.get("/:id", getPublicProfile);

module.exports = router;