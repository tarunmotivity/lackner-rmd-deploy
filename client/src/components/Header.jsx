import SummaryCards from "./SummaryCards";

const Header = () => {
  return (
    <div className="p-6 border-b bg-white/70 backdrop-blur">

      
      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <p className="text-xs text-gray-500">
            RMD Projection & Tax Optimization
          </p>
        </div>

        
      </div>

      
      <SummaryCards />

    </div>
  );
};

export default Header;