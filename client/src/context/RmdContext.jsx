import { createContext, useState, useEffect } from "react";
import { calculateRmd } from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const RmdContext = createContext();

export const RmdProvider = ({ children }) => {
  const [inputs, setInputs] = useState({
    balance_Start: 1000000,
    growth_Rate: 6,
    tax_Rate: 24,
    year_Birth_Owner: 1953,
    year_Birth_Beny: 1965,
    date_Death_Owner: "",
    scenario: "LIVING_UNIFORM",
    plan: "IRA",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await calculateRmd(inputs);
        setResult(res.result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputs]);

  return (
    <RmdContext.Provider value={{ inputs, setInputs, result, loading }}>
      {children}
    </RmdContext.Provider>
  );
};