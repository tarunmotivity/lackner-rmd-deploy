import {
  Box,
  Typography,
} from "@mui/material";

import CascadeFlow3D from "./CascadeFlow3D";

import { useThemeContext } from "../context/ThemeContext";

const WaterfallChart = () => {
  const { mode } =
    useThemeContext();

  const isDark =
    mode === "dark";

  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: "22px",

        overflow: "hidden",

        background: isDark
          ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)"
          : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",

        border: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(15,23,42,0.08)",

        boxShadow: isDark
          ? "0 12px 35px rgba(0,0,0,0.4)"
          : "0 6px 20px rgba(15,23,42,0.08)",

        backdropFilter: "blur(10px)",

        p: 2,

        transition:
          "all 0.3s ease",
      }}
    >
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
            ? "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.85))"
            : "linear-gradient(135deg, #ffffff, #f8fafc)",

          border: isDark
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",

          boxShadow: isDark
            ? "0 6px 18px rgba(0,0,0,0.3)"
            : "0 4px 12px rgba(15,23,42,0.06)",
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
            Financial Waterfall
          </Typography>

          <Typography
            sx={{
              mt: 0.3,

              fontSize: 12,

              color: isDark
                ? "rgba(255,255,255,0.65)"
                : "#64748b",
            }}
          >
            Cinematic 3D Wealth
            Flow Visualization
          </Typography>
        </Box>

        {/* RIGHT */}

        <Box
          sx={{
            px: 1.5,

            py: 0.7,

            borderRadius: "10px",

            background: isDark
              ? "rgba(0,212,255,0.08)"
              : "rgba(14,165,233,0.08)",

            border: isDark
              ? "1px solid rgba(0,212,255,0.12)"
              : "1px solid rgba(14,165,233,0.12)",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,

              fontWeight: 700,

              color: "#38bdf8",

              letterSpacing:
                "0.2px",
            }}
          >
            LIVE
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          CHART
      ===================================================== */}

      <Box
        sx={{
          borderRadius: "18px",

          overflow: "hidden",

          border: isDark
            ? "1px solid rgba(255,255,255,0.04)"
            : "1px solid rgba(15,23,42,0.06)",

          background: isDark
            ? "#020617"
            : "#ffffff",

          height: "420px",
        }}
      >
        <CascadeFlow3D />
      </Box>
    </Box>
  );
};

export default WaterfallChart;