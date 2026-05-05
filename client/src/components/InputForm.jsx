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

  const inputClass = "w-full border border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] p-2 rounded focus:outline-none focus:border-purple-500 transition-colors duration-300";

  return (
    <div className="glass p-6 rounded-2xl space-y-5 shadow text-[var(--text-primary)] transition-colors duration-300">

      <h3 className="font-semibold text-lg">Input Parameters</h3>

      <div>
        <label className="text-xs text-[var(--text-secondary)]">Starting Balance ($)</label>
        <input
          name="balance_Start"
          value={inputs.balance_Start}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[var(--text-secondary)]">Growth Rate (%)</label>
          <input
            name="growth_Rate"
            value={inputs.growth_Rate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-[var(--text-secondary)]">Tax Rate (%)</label>
          <input
            name="tax_Rate"
            value={inputs.tax_Rate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)]">Owner’s Year of Birth</label>
        <input
          name="year_Birth_Owner"
          value={inputs.year_Birth_Owner}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)]">
          Beneficiary Year of Birth
        </label>
        <input
          name="year_Birth_Beny"
          value={inputs.year_Birth_Beny}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)]">
          Date of Owner’s Death
        </label>
        <input
          type="date"
          name="date_Death_Owner"
          value={inputs.date_Death_Owner}
          onChange={(e) =>
            setInputs({ ...inputs, date_Death_Owner: e.target.value })
          }
          className={inputClass}
        />
      </div>

      <div>
        <label className="text-xs text-[var(--text-secondary)]">Plan Type</label>
        <select
          value={inputs.plan}
          onChange={(e) =>
            setInputs({ ...inputs, plan: e.target.value })
          }
          className={inputClass}
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
            className={`w-full text-left p-2 rounded mb-2 text-sm transition-colors duration-300 ${
              inputs.scenario === s.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-slate-600"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-4 border-t border-[var(--border-color)] pt-3 transition-colors duration-300">
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
          DISPLAY
        </h4>

        <div className="flex gap-4 mb-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showChart}
              onChange={() => setShowChart(!showChart)}
              className="accent-purple-600"
            /> Chart
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTable}
              onChange={() => setShowTable(!showTable)}
              className="accent-purple-600"
            /> Table
          </label>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrowth}
              onChange={() => setShowGrowth(!showGrowth)}
              className="accent-purple-600"
            /> Growth
          </label>

          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showTax}
              onChange={() => setShowTax(!showTax)}
              className="accent-purple-600"
            /> Tax
          </label>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap pt-3">
        <button className="bg-purple-600 hover:bg-purple-700 transition-colors text-white px-4 py-2 rounded">
          Calculate
        </button>

        <button
          onClick={handleReset}
          className="border border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors px-4 py-2 rounded"
        >
          Reset
        </button>

        <button
          onClick={handlePrint}
          className="border border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors px-4 py-2 rounded"
        >
          Print
        </button>

        <button
          onClick={handleExport}
          className="border border-[var(--border-color)] hover:bg-[var(--hover-bg)] transition-colors px-4 py-2 rounded"
        >
          Export JSON
        </button>
      </div>

    </div>
  );
};

export default InputForm;