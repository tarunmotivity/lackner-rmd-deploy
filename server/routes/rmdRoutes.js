
const express = require("express");
const router = express.Router();
const { calculateRmd } = require("../controllers/rmdController");

router.post("/calculate", calculateRmd);

module.exports = router;