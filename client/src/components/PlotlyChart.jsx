import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import Plotly from "plotly.js-dist-min";

const PlotlyChart = forwardRef(
  (
    {
      data,
      layout,
      onHover,
      onUnhover,
      onClick,
    },
    ref
  ) => {
    const chartRef = useRef(null);
    const plotlyInstance = useRef(null);

    useImperativeHandle(ref, () => ({
      getPlotlyElement: () => chartRef.current,
      getInstance: () => plotlyInstance.current,
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
          displayModeBar: false,
        }
      ).then((gd) => {
        plotlyInstance.current = gd;

        gd.removeAllListeners?.("plotly_hover");
        gd.removeAllListeners?.("plotly_unhover");
        gd.removeAllListeners?.("plotly_click");

        if (onHover) {
          gd.on("plotly_hover", onHover);
        }

        if (onUnhover) {
          gd.on("plotly_unhover", onUnhover);
        }

        if (onClick) {
          gd.on("plotly_click", onClick);
        }
      });

      return () => {
        if (chartEl) {
          Plotly.purge(chartEl);
        }
      };
    }, [data, layout, onHover, onUnhover, onClick]);

    return (
      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    );
  }
);

export default PlotlyChart;