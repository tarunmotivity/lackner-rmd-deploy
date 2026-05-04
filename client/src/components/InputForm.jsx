// eslint-disable-next-line no-unused-vars
import { useState } from "react";
import useRmd from "../hooks/useRmd";

const scenarios = [
  { id: "LIVING_UNIFORM", label: "Chart 01 · Uniform Lifetime" },
  { id: "LIVING_JOINT", label: "Chart 00 · Spouse >10y Younger" },
  { id: "DECEASED_SPOUSE_INHERIT", label: "Chart 03 · Spouse Inherited" },
  { id: "DECEASED_EDB_SINGLELIFE", label: "Chart 05 · Non-Spouse EDB" },
  { id: "DECEASED_10YEAR", label: "Chart 11 · 10-Year Rule" },
  { id: "DECEASED_10YEAR_ANNUAL", label: "Chart 12 · 10-Year + Annual" },
];

const InputForm = ({
  showChart,
  setShowChart,
  showTable,
  setShowTable,
  showGrowth,
  setShowGrowth,
  showTax,
  setShowTax,
}) => {
  const { inputs, setInputs } = useRmd();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: name.includes("date") ? value : Number(value),
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(inputs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rmd-data.json";
    a.click();
  };

  return (
    <div className="glass p-6 rounded-2xl space-y-5 shadow">

      <h3 className="font-semibold text-lg">Input Parameters</h3>

      
      <div>
        <label className="text-xs text-gray-500">Starting Balance ($)</label>
        <input
          name="balance_Start"
          value={inputs.balance_Start}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Growth Rate (%)</label>
          <input
            name="growth_Rate"
            value={inputs.growth_Rate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Tax Rate (%)</label>
          <input
            name="tax_Rate"
            value={inputs.tax_Rate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      
      <div>
        <label className="text-xs text-gray-500">Owner’s Year of Birth</label>
        <input
          name="year_Birth_Owner"
          value={inputs.year_Birth_Owner}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500">
          Beneficiary Year of Birth
        </label>
        <input
          name="year_Birth_Beny"
          value={inputs.year_Birth_Beny}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      
      <div>
        <label className="text-xs text-gray-500">
          Date of Owner’s Death
        </label>
        <input
          type="date"
          name="date_Death_Owner"
          value={inputs.date_Death_Owner}
          onChange={(e) =>
            setInputs({ ...inputs, date_Death_Owner: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

  
      <div>
        <label className="text-xs text-gray-500">Plan Type</label>
        <select
          value={inputs.plan}
          onChange={(e) =>
            setInputs({ ...inputs, plan: e.target.value })
          }
          className="w-full border p-2 rounded"
        >
          <option value="IRA">Traditional IRA</option>
          <option value="401k">401(k)</option>
          <option value="Roth">Roth IRA</option>
        </select>
      </div>

      
      <div>
        <h4 className="text-sm font-semibold mb-2">Scenario</h4>

        {scenarios.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              setInputs({ ...inputs, scenario: s.id })
            }
            className={`w-full text-left p-2 rounded mb-2 text-sm ${
              inputs.scenario === s.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      
      <div className="mt-4 border-t pt-3">
        <h4 className="text-xs font-semibold text-gray-500 mb-2">
          DISPLAY
        </h4>

        <div className="flex gap-4 mb-2">
          <label>
            <input
              type="checkbox"
              checked={showChart}
              onChange={() => setShowChart(!showChart)}
            /> Chart
          </label>

          <label>
            <input
              type="checkbox"
              checked={showTable}
              onChange={() => setShowTable(!showTable)}
            /> Table
          </label>
        </div>

        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              checked={showGrowth}
              onChange={() => setShowGrowth(!showGrowth)}
            /> Growth
          </label>

          <label>
            <input
              type="checkbox"
              checked={showTax}
              onChange={() => setShowTax(!showTax)}
            /> Tax
          </label>
        </div>
      </div>

      
      <div className="flex gap-2 flex-wrap pt-3">
        <button className="bg-purple-600 text-white px-4 py-2 rounded">
          Calculate
        </button>

        <button
          onClick={handleReset}
          className="border px-4 py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={handlePrint}
          className="border px-4 py-2 rounded"
        >
          Print
        </button>

        <button
          onClick={handleExport}
          className="border px-4 py-2 rounded"
        >
          Export JSON
        </button>
      </div>

    </div>
  );
};

export default InputForm;