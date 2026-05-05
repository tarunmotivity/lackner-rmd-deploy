import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Plotly from "plotly.js-dist-min";

const PlotlyChart = forwardRef(({ data, layout }, ref) => {
  const chartRef = useRef(null);
  const plotlyInstance = useRef(null);

  useImperativeHandle(ref, () => ({
    getPlotlyElement: () => chartRef.current,
    getInstance: () => plotlyInstance.current
  }));

  useEffect(() => {
    const chartEl = chartRef.current;
    if (!chartEl) return;

    Plotly.react(
      chartEl,
      data,
      {
        ...layout,
        autosize: true,
      },
      {
        responsive: true,
        displayModeBar: true,
      }
    ).then((gd) => {
      plotlyInstance.current = gd;
    });

    return () => {
      if (chartEl) Plotly.purge(chartEl);
    };
  }, [data, layout]);

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />;
});

export default PlotlyChart;