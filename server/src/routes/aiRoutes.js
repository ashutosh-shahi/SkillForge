const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getPortfolioDiagnosis } = require("../controllers/aiController");

const router = express.Router();

// Protected AI Diagnosis endpoints (both GET and POST supported for flexible calling)
router.get("/diagnose", protect, getPortfolioDiagnosis);
router.post("/diagnose", protect, getPortfolioDiagnosis);

module.exports = router;
