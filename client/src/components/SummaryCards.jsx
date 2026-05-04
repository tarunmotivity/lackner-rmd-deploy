import useRmd from "../hooks/useRmd";

const format = (n) =>
  "$" + Math.round(n || 0).toLocaleString();

const SummaryCards = () => {
  const { result } = useRmd();

  if (!result) return null;

  return (
    <div className="grid grid-cols-4 gap-4 mt-4">

      
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl border">
        <p className="text-xs text-gray-500 uppercase">Starting Balance</p>
        <h2 className="text-xl font-semibold">
          {format(result.balanceStart)}
        </h2>
        <p className="text-xs text-gray-400">
          {result.rows?.length || 0} years projected
        </p>
      </div>

      
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl border">
        <p className="text-xs text-gray-500 uppercase">Total RMDs</p>
        <h2 className="text-xl font-semibold">
          {format(result.totalRmd)}
        </h2>
        <p className="text-xs text-gray-400">
          {((result.totalRmd / result.balanceStart) * 100).toFixed(1)}% of start
        </p>
      </div>

     
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl border">
        <p className="text-xs text-gray-500 uppercase">Total Taxes</p>
        <h2 className="text-xl font-semibold text-red-500">
          {format(result.totalTax)}
        </h2>
        <p className="text-xs text-gray-400">
          {((result.totalTax / result.totalRmd) * 100).toFixed(1)}% of RMDs
        </p>
      </div>

      
      <div className="bg-white/70 backdrop-blur p-4 rounded-xl border">
        <p className="text-xs text-gray-500 uppercase">Ending Balance</p>
        <h2 className="text-xl font-semibold">
          {format(result.endingBalance)}
        </h2>
        <p className="text-xs text-gray-400">
          Final projected value
        </p>
      </div>

    </div>
  );
};

export default SummaryCards;