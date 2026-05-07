/* eslint-disable no-unused-vars */

import {
  useState,
} from "react";

import useRmd from "../hooks/useRmd";

import {
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Box,
} from "@mui/material";

import ProjectionOrbitals from "./ProjectionOrbitals";
import PieChart3D from "./PieChart3D";
import ThreeDBarChart from "./ThreeDBarChart";
import WealthMountainSurface from "./WealthMountainSurface";
import ThreeDCandleChart from "./ThreeDCandleChart";
import ScatterProjection from "./ScatterProjection";
import GlobalAnalytics from "./GlobalAnalytics";

import { formatCurrency } from "../utils/format";

import { useThemeContext } from "../context/ThemeContext";

const AdvancedChart = () => {
  const { result, inputs } =
    useRmd();

  const { mode } =
    useThemeContext();

  const isDark =
    mode === "dark";

  const [view, setView] =
    useState("projection");

  const handleChange = (
    _,
    newView
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const isDeceased =
    inputs?.scenario?.includes(
      "DECEASED"
    );

  if (
    isDeceased &&
    !inputs.date_Death_Owner
  ) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">
            Enter Date of Death
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (
    !result ||
    result.rows.length === 0
  ) {
    return (
      <Card>
        <CardContent>
          <Typography align="center">
            No Projection Available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // =====================================================
  // DATA
  // =====================================================

  const data = result.rows.map(
    (r) => ({
      label: `${r.age} (${r.year})`,
      year: r.year,
      age: r.age,

      balance: r.endBalance || 0,
      growth: r.growth || 0,
      rmd: r.rmd || 0,
      tax: r.tax || 0,
    })
  );

  const pieData = [
    {
      label: "Withdrawals",
      value: result.totalRmd,
    },
    {
      label: "Taxes",
      value: result.totalTax,
    },
    {
      label: "Growth",
      value: result.totalGrowth,
    },
  ];

  const total =
    result.totalRmd +
    result.totalTax +
    result.totalGrowth;

  // =====================================================
  // HEIGHT
  // =====================================================

  const containerHeight =
  view === "projection" ||
  view === "mountain" ||
  view === "globalAnalytics"
    ? 480
    : view === "candle"
    ? 520
    : view === "scattered"
    ? 480
    : 340;
    

  return (
    <Card
      sx={{
        borderRadius: 4,

        overflow: "hidden",

        background: isDark
          ? "linear-gradient(180deg, #0f172a 0%, #111827 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

        color: isDark
          ? "#ffffff"
          : "#111827",

        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.08)",

        boxShadow: isDark
          ? "0 8px 28px rgba(0,0,0,0.35)"
          : "0 4px 18px rgba(15,23,42,0.08)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",

            mb: 1.8,

            p: 1.2,

            borderRadius: "16px",

            background: isDark
              ? "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,41,59,0.88))"
              : "linear-gradient(135deg, #ffffff, #f8fafc)",

            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(15,23,42,0.08)",

            boxShadow: isDark
              ? "0 6px 18px rgba(0,0,0,0.3)"
              : "0 4px 12px rgba(15,23,42,0.06)",

            backdropFilter:
              "blur(10px)",
          }}
        >
          {/* LEFT */}

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,

                letterSpacing:
                  "-0.3px",

                color: isDark
                  ? "#ffffff"
                  : "#0f172a",
              }}
            >
              Financial Projection
            </Typography>

            <Typography
              sx={{
                mt: 0.3,

                fontSize: 12,

                color: isDark
                  ? "rgba(255,255,255,0.62)"
                  : "#64748b",
              }}
            >
              Interactive Wealth
              Visualization
            </Typography>
          </Box>

          {/* RIGHT */}

          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            size="small"
            sx={{
              gap: 0.5,

              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(15,23,42,0.04)",

              borderRadius:
                "14px",

              padding: "4px",

              border: isDark
                ? "1px solid rgba(255,255,255,0.06)"
                : "1px solid rgba(15,23,42,0.08)",
            }}
          >
            {[
              {
                label:
                  "Projection",
                value:
                  "projection",
              },
              {
                label: "Bar",
                value: "bar",
              },
              {
                label: "Pie",
                value: "pie",
              },
              {
                label:
                  "Mountain",
                value:
                  "mountain",
              },
              {
                label:
                  "Candle",
                value:
                  "candle",
              },
              {
                label:
                  "Scatter",
                value:
                  "scattered",
              },
              {
                label: "Analytics",
                value: "globalAnalytics",
              }
            ].map((item) => (
              <ToggleButton
                key={item.value}
                value={
                  item.value
                }
                sx={{
                  px: 1.5,
                  py: 0.6,

                  border:
                    "none !important",

                  borderRadius:
                    "10px",

                  textTransform:
                    "none",

                  fontWeight: 700,

                  fontSize:
                    "12px",

                  color: isDark
                    ? "rgba(255,255,255,0.75)"
                    : "#475569",

                  transition:
                    "all 0.25s ease",

                  "&.Mui-selected":
                    {
                      color:
                        "#ffffff",

                      background:
                        "linear-gradient(135deg, #0ea5e9, #2563eb)",

                      boxShadow:
                        "0 4px 12px rgba(14,165,233,0.25)",
                    },

                  "&:hover": {
                    background:
                      isDark
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(15,23,42,0.06)",
                  },

                  "&.Mui-selected:hover":
                    {
                      background:
                        "linear-gradient(135deg, #0ea5e9, #2563eb)",
                    },
                }}
              >
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <Box
          sx={{
            width: "100%",
            height:
              containerHeight,

            transition:
              "height 0.35s ease",
          }}
        >
          {/* PROJECTION */}

          {view ===
            "projection" && (
            <ProjectionOrbitals
              data={data}
            />
          )}

          {/* BAR */}

          {view === "bar" && (
            <ThreeDBarChart
              data={data}
              formatCurrency={
                formatCurrency
              }
            />
          )}

          {/* MOUNTAIN */}

          {view ===
            "mountain" && (
            <WealthMountainSurface
              data={data}
            />
          )}

          {/* CANDLE */}

          {view ===
            "candle" && (
            <ThreeDCandleChart
              data={data}
            />
          )}

          {/* SCATTER */}

          {view === "scattered" && (
            <ScatterProjection
              data={data}
            />
          )}

          {view === "globalAnalytics" && (
            <GlobalAnalytics />
          )}

          {/* PIE */}

          {view === "pie" && (
            <Box
              sx={{
                width: "100%",
                height: "100%",

                display: "flex",

                alignItems:
                  "center",

                justifyContent:
                  "space-between",

                gap: 1.5,
              }}
            >
              {/* LEFT */}

              <Box
                sx={{
                  flex: 1.5,
                  height: "100%",
                  minHeight: 280,
                }}
              >
                <PieChart3D
                  data={pieData}
                />
              </Box>

              {/* RIGHT */}

              <Box
                sx={{
                  flex: 1,

                  display: "flex",

                  flexDirection:
                    "column",

                  gap: 1.2,
                }}
              >
                {pieData
                  .filter(
                    (item) =>
                      Number(
                        item.value
                      ) > 0
                  )
                  .map(
                    (
                      item,
                      i
                    ) => {
                      const percent =
                        (
                          (item.value /
                            total) *
                          100
                        ).toFixed(
                          1
                        );

                      const lower =
                        item.label.toLowerCase();

                      let color =
                        "#00d4ff";

                      if (
                        lower.includes(
                          "withdraw"
                        )
                      ) {
                        color =
                          "#7c3aed";
                      }

                      if (
                        lower.includes(
                          "tax"
                        )
                      ) {
                        color =
                          "#ef4444";
                      }

                      if (
                        lower.includes(
                          "growth"
                        )
                      ) {
                        color =
                          "#22c55e";
                      }

                      return (
                        <Box
                          key={i}
                          sx={{
                            display:
                              "flex",

                            justifyContent:
                              "space-between",

                            alignItems:
                              "center",

                            p: 1.2,

                            borderRadius:
                              "14px",

                            background:
                              isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(15,23,42,0.03)",

                            border:
                              isDark
                                ? "1px solid rgba(255,255,255,0.06)"
                                : "1px solid rgba(15,23,42,0.08)",

                            transition:
                              "all 0.25s ease",
                          }}
                        >
                          {/* LEFT */}

                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Box
                              sx={{
                                width: 9,

                                height: 9,

                                borderRadius:
                                  "3px",

                                backgroundColor:
                                  color,

                                boxShadow: `0 0 10px ${color}`,
                              }}
                            />

                            <Typography
                              sx={{
                                color:
                                  isDark
                                    ? "#ffffff"
                                    : "#111827",

                                fontSize: 13,

                                fontWeight: 500,
                              }}
                            >
                              {
                                item.label
                              }
                            </Typography>
                          </Box>

                          {/* RIGHT */}

                          <Box textAlign="right">
                            <Typography
                              sx={{
                                color:
                                  isDark
                                    ? "#ffffff"
                                    : "#111827",

                                fontWeight: 700,

                                fontSize: 13,
                              }}
                            >
                              {formatCurrency(
                                item.value
                              )}
                            </Typography>

                            <Typography
                              sx={{
                                color:
                                  isDark
                                    ? "rgba(255,255,255,0.72)"
                                    : "rgba(17,24,39,0.65)",

                                fontSize: 11,

                                mt: 0.2,
                              }}
                            >
                              {
                                percent
                              }
                              %
                            </Typography>
                          </Box>
                        </Box>
                      );
                    }
                  )}
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AdvancedChart;