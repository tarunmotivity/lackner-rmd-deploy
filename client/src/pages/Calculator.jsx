import { useState } from "react";

import Header from "../components/Header";
import InputForm from "../components/InputForm";
import WaterfallChart from "../components/WaterfallChart";
import AdvancedChart from "../components/AdvancedChart";
import DataTable from "../components/DataTable";


const Calculator = () => {
  const [showChart, setShowChart] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [showGrowth, setShowGrowth] = useState(false);
  const [showTax, setShowTax] = useState(true);

  return (
    <div className="flex">

      <div className="flex-1">

        <Header />

        <div className="p-6 grid grid-cols-12 gap-6">

          {/* LEFT */}
          <div className="col-span-4">
            <InputForm
              showChart={showChart}
              setShowChart={setShowChart}
              showTable={showTable}
              setShowTable={setShowTable}
              showGrowth={showGrowth}
              setShowGrowth={setShowGrowth}
              showTax={showTax}
              setShowTax={setShowTax}
            />
          </div>

         
          <div className="col-span-8 space-y-6">

            {showChart && <AdvancedChart />}
            {showChart && <WaterfallChart />}
            {showTable && <DataTable />}


          </div>

        </div>

      </div>

    </div>
  );
};

export default Calculator;