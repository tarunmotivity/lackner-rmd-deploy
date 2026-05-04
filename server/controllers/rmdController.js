const calculateSchedule = require("../services/rmdCalculator");
const RmdScenario = require("../models/RmdScenario");

exports.calculateRmd = async (req, res) => {
  try {
    const inputs = req.body;

    const result = calculateSchedule(inputs);

    
    await RmdScenario.create({
      inputs,
      result
    });

   
    res.json({ result });
    console.log("Incoming Inputs:", req.body);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};