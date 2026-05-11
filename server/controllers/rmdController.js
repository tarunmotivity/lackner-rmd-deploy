const calculateSchedule = require("../services/rmdCalculator");
const RmdScenario = require("../models/rmdScenario");

exports.calculateRmd = async (req, res) => {
  try {
    const inputs = req.body;

    const result = calculateSchedule(inputs);

    
    await RmdScenario.create({
      inputs,
      result
    });

   
    
    console.log("Incoming Inputs:", req.body);
    console.log("✅ Saved to DB");
    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};