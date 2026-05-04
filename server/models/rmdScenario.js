
const mongoose = require("mongoose");

const rowSchema = new mongoose.Schema({
  yr: Number,
  year: Number,
  age: Number,
  factor: Number,
  beginBalance: Number,
  rmd: Number,
  tax: Number,
  net: Number,
  growth: Number,
  endBalance: Number,
  cumRmd: Number,
  cumTax: Number,
  cumGrowth: Number
});

const rmdSchema = new mongoose.Schema(
  {
    inputs: Object,
    result: {
      balanceStart: Number,
      totalRmd: Number,
      totalTax: Number,
      totalGrowth: Number,
      endingBalance: Number,
      rows: [rowSchema]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RmdScenario", rmdSchema);