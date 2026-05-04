// ================= IRS TABLE III (Uniform Lifetime) =================
const TABLE_III_UNIFORM = {
  70: 27.4, 71: 26.5, 72: 25.6, 73: 24.7, 74: 23.8,
  75: 22.9, 76: 22.0, 77: 21.1, 78: 20.2, 79: 19.4,
  80: 18.5, 81: 17.7, 82: 16.8, 83: 16.0, 84: 15.2,
  85: 14.4, 86: 13.7, 87: 12.9, 88: 12.2, 89: 11.5,
  90: 10.8, 91: 10.1, 92: 9.5, 93: 8.9, 94: 8.4,
  95: 7.8, 96: 7.3, 97: 6.8, 98: 6.4, 99: 6.0,
  100: 5.6, 101: 5.2, 102: 4.9, 103: 4.6, 104: 4.3,
  105: 4.1, 106: 3.8, 107: 3.6, 108: 3.4, 109: 3.1,
  110: 2.9, 111: 2.7, 112: 2.5, 113: 2.4, 114: 2.1,
  115: 1.9, 116: 1.8, 117: 1.7, 118: 1.6, 119: 1.5,
  120: 1.4
};

// ================= IRS TABLE I (Single Life) =================
const TABLE_I_SINGLE = {
  0: 82.4, 1: 81.6, 2: 80.6, 3: 79.7, 4: 78.8,
  5: 77.9, 6: 76.9, 7: 76.0, 8: 75.1, 9: 74.1,
  10: 73.2, 20: 63.0, 30: 53.3, 40: 43.6,
  50: 34.2, 60: 25.2, 65: 21.1, 70: 17.0,
  75: 13.4, 80: 10.2, 85: 7.6, 90: 5.5,
  95: 3.8, 100: 2.5
};

// ================= RBD AGE =================
function getRbdAge(yearOfBirth) {
  if (yearOfBirth <= 1949) return 70.5;
  if (yearOfBirth <= 1950) return 72;
  if (yearOfBirth <= 1959) return 73;
  return 75;
}

// ================= EMPTY SAFE RESULT =================
function emptyResult(balanceStart) {
  return {
    balanceStart,
    totalRmd: 0,
    totalTax: 0,
    totalGrowth: 0,
    endingBalance: balanceStart,
    rows: []
  };
}

// ================= MAIN CALC =================
function calculateSchedule(inputs) {

  const rows = [];
  const maxYears = 50;

  const balanceStart = +inputs.balance_Start || 0;
  const growthRate = (+inputs.growth_Rate || 0) / 100;
  const taxRate = (+inputs.tax_Rate || 0) / 100;
  const birthOwner = +inputs.year_Birth_Owner;
  const birthBeny = +inputs.year_Birth_Beny;

  const deathDate = inputs.date_Death_Owner
    ? new Date(inputs.date_Death_Owner)
    : null;

  const isDeathValid = deathDate && !isNaN(deathDate);

  const scenario = inputs.scenario || "LIVING_UNIFORM";

  let balance = balanceStart;
  let cumRmd = 0;
  let cumTax = 0;
  let cumGrowth = 0;

  let startYear, startAge, factorFn, yearsToDistribute = null;

  // ================= SCENARIOS =================

  if (scenario === "LIVING_UNIFORM") {
    const rbdAge = getRbdAge(birthOwner);
    startAge = Math.floor(rbdAge);
    startYear = birthOwner + startAge;
    factorFn = (age) => TABLE_III_UNIFORM[age] || 2.0;
  }

  else if (scenario === "LIVING_JOINT") {
    const rbdAge = getRbdAge(birthOwner);
    startAge = Math.floor(rbdAge);
    startYear = birthOwner + startAge;

    factorFn = (age, yr) => {
      const ownerAge = startAge + (yr - startYear);
      const uniform = TABLE_III_UNIFORM[ownerAge] || 2.0;
      const diff = Math.max(0, (birthBeny - birthOwner) - 10);
      return uniform + diff * 0.3;
    };
  }

  else if (scenario === "DECEASED_SPOUSE_INHERIT") {

    if (!isDeathValid) return emptyResult(balanceStart);

    const deathYear = deathDate.getFullYear();
    startYear = deathYear + 1;
    startAge = startYear - birthBeny;

    factorFn = (age) => TABLE_I_SINGLE[age] || 2.0;
  }

  else if (scenario === "DECEASED_EDB_SINGLELIFE") {

    if (!isDeathValid) return emptyResult(balanceStart);

    const deathYear = deathDate.getFullYear();
    startYear = deathYear + 1;
    startAge = startYear - birthBeny;

    const initialFactor = TABLE_I_SINGLE[startAge] || 2.0;

    factorFn = (age, yr) =>
      Math.max(initialFactor - (yr - startYear), 1.0);
  }

  else if (scenario === "DECEASED_10YEAR") {

    if (!isDeathValid) return emptyResult(balanceStart);

    const deathYear = deathDate.getFullYear();
    startYear = deathYear + 1;
    startAge = startYear - birthBeny;

    yearsToDistribute = 10;

    factorFn = (age, yr) => {
      const yrInPlan = yr - startYear + 1;
      return yrInPlan < 10 ? Infinity : 1.0;
    };
  }

  else if (scenario === "DECEASED_10YEAR_ANNUAL") {

    if (!isDeathValid) return emptyResult(balanceStart);

    const deathYear = deathDate.getFullYear();
    startYear = deathYear + 1;
    startAge = startYear - birthBeny;

    const initialFactor = TABLE_I_SINGLE[startAge] || 2.0;

    factorFn = (age, yr) => {
      const yrInPlan = yr - startYear + 1;
      if (yrInPlan >= 10) return 1.0;
      return Math.max(initialFactor - (yr - startYear), 1.0);
    };
  }

  // ================= CALC LOOP =================

  for (let i = 0; i < maxYears; i++) {

    const year = startYear + i;
    const age = startAge + i;

    if (balance <= 0.01) break;

    const factor = factorFn(age, year);

    let rmd = factor === Infinity ? 0 : balance / factor;
    if (rmd > balance) rmd = balance;

    const tax = rmd * taxRate;
    const afterRmd = balance - rmd;
    const growth = afterRmd * growthRate;
    const endBalance = afterRmd + growth;

    cumRmd += rmd;
    cumTax += tax;
    cumGrowth += growth;

    rows.push({
      year,
      age,
      beginBalance: balance,
      rmd,
      tax,
      growth,
      endBalance
    });

    balance = endBalance;

    if (yearsToDistribute && i + 1 >= yearsToDistribute) break;
  }

  return {
    balanceStart,
    totalRmd: cumRmd,
    totalTax: cumTax,
    totalGrowth: cumGrowth,
    endingBalance: rows.length
      ? rows[rows.length - 1].endBalance
      : balanceStart,
    rows
  };
}

module.exports = calculateSchedule;