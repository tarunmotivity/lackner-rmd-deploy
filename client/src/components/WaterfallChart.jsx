import { useState } from "react";
import useRmd from "../hooks/useRmd";
import PlotlyChart from "./PlotlyChart";
import { useThemeContext } from "../context/ThemeContext";

import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const WaterfallProjection = () => {
  const { mode } = useThemeContext();
  const { result } = useRmd();

  const [view, setView] = useState("stack");
  const [hoverIndex, setHoverIndex] = useState(null);

  if (!result || result.rows.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">No Data</Typography>
        </CardContent>
      </Card>
    );
  }

  const rows = result.rows.slice(0, 20);
  const yLabels = rows.map((r) => `${r.year} - ${r.age}`);

  // Tooltip data
  const customData = rows.map((r) => [
    r.beginBalance,
    r.rmd,
    r.tax,
    r.growth,
    r.endBalance,
  ]);

  // 🔥 Highlight strip
  const shapes =
    hoverIndex !== null
      ? [
          {
            type: "rect",
            xref: "paper",
            yref: "y",
            x0: 0,
            x1: 1,
            y0: yLabels[hoverIndex],
            y1: yLabels[hoverIndex],
            fillcolor:
              mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            line: { width: 0 },
          },
        ]
      : [];

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>

        {/* HEADER */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Waterfall Projection</Typography>

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => v && setView(v)}
            size="small"
          >
            <ToggleButton value="stack">STACKED</ToggleButton>
            <ToggleButton value="group">GROUPED</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* CHART */}
        <Box sx={{ width: "100%", height: 520 }}>
          <PlotlyChart
            data={[
              // ✅ Principal (controls hover)
              {
                x: rows.map((r) => r.beginBalance),
                y: yLabels,
                type: "bar",
                orientation: "h",
                name: "Principal",
                customdata: customData,
                marker: {
                  color: "#2E7D32",
                  opacity: 0.9,
                },

                hovertemplate:
                  "<b>Year %{y}</b><br><br>" +
                  "🟩 Principal: %{customdata[0]:$,.0f}<br>" +
                  "🟣 RMD: %{customdata[1]:$,.0f}<br>" +
                  "🔴 Tax: %{customdata[2]:$,.0f}<br>" +
                  "🟢 Growth: %{customdata[3]:$,.0f}<br><br>" +
                  "<b>End Balance: %{customdata[4]:$,.0f}</b>" +
                  "<extra></extra>",
              },

              // ❌ Other bars (no hover)
              {
                x: rows.map((r) => r.rmd),
                y: yLabels,
                type: "bar",
                orientation: "h",
                name: "RMD",
                marker: { color: "#7B1FA2" },
                hoverinfo: "skip",
              },
              {
                x: rows.map((r) => r.tax),
                y: yLabels,
                type: "bar",
                orientation: "h",
                name: "Tax",
                marker: { color: "#D32F2F" },
                hoverinfo: "skip",
              },
              {
                x: rows.map((r) => r.growth),
                y: yLabels,
                type: "bar",
                orientation: "h",
                name: "Growth",
                marker: { color: "#66BB6A" },
                hoverinfo: "skip",
              },
            ]}
            layout={{
              barmode: view === "stack" ? "stack" : "group",
              hovermode: "closest",

              // 🔥 Tooltip style
              hoverlabel: {
                bgcolor: "#111827",
                bordercolor: "#1f2937",
                font: {
                  color: "#f9fafb",
                  size: 13,
                },
              },

              plot_bgcolor: mode === "dark" ? "#1e293b" : "#f9fafb",
              paper_bgcolor: mode === "dark" ? "#1e293b" : "#ffffff",

              xaxis: {
                tickprefix: "$",
                tickformat: ",.0f",
                gridcolor: mode === "dark" ? "#334155" : "#eee",
              },

              yaxis: {
                automargin: true,
                gridcolor: mode === "dark" ? "#334155" : "#eee",
              },

              legend: {
                orientation: "h",
                y: -0.25,
                x: 0.5,
                xanchor: "center",
              },

              shapes,
              margin: { t: 40, l: 120, r: 20, b: 80 },
            }}

            
            onHover={(e) => {
              if (e.points && e.points.length > 0) {
                setHoverIndex(e.points[0].pointIndex);
              }
            }}
            onUnhover={() => setHoverIndex(null)}
          />
        </Box>

      </CardContent>
    </Card>
  );
};

export default WaterfallProjection;