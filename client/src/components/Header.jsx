import SummaryCards from "./SummaryCards";
import { useThemeContext } from "../context/ThemeContext";

const Header = () => {
  const { mode, toggleTheme } = useThemeContext();

  return (
    <div className="p-6 border-b border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Dashboard</h2>
          <p className="text-xs text-[var(--text-secondary)]">
            RMD Projection & Tax Optimization
          </p>
        </div>
        
        <button
          onClick={toggleTheme}
          className="px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] text-sm transition-colors duration-300 shadow-sm"
          aria-label="Toggle Dark Mode"
        >
          {mode === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <SummaryCards />
    </div>
  );
};

export default Header;