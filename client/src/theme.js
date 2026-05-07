export const getDesignTokens = (mode) => ({
  palette: {
    mode,

    ...(mode === "dark"
      ? {
          background: {
            default: "#020617",
            paper: "#0f172a",
          },

          text: {
            primary: "#f8fafc",
            secondary: "#94a3b8",
          },

          divider: "#334155",
        }
      : {
          background: {
            default: "#f1f5f9",
            paper: "#ffffff",
          },

          text: {
            primary: "#0f172a",
            secondary: "#64748b",
          },

          divider: "#cbd5e1",
        }),
  },

  typography: {
    fontFamily:
      "'Inter', sans-serif",

    h1: {
      fontWeight: 800,
      fontSize: "32px",
      lineHeight: 1.2,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    h2: {
      fontWeight: 700,
      fontSize: "28px",
      lineHeight: 1.25,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    h3: {
      fontWeight: 700,
      fontSize: "24px",
      lineHeight: 1.3,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    h4: {
      fontWeight: 700,
      fontSize: "20px",
      lineHeight: 1.35,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    h5: {
      fontWeight: 700,
      fontSize: "18px",
      lineHeight: 1.4,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    h6: {
      fontWeight: 700,
      fontSize: "16px",
      lineHeight: 1.45,

      color:
        mode === "dark"
          ? "#f8fafc"
          : "#0f172a",
    },

    body1: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: 1.6,

      color:
        mode === "dark"
          ? "#e2e8f0"
          : "#1e293b",
    },

    body2: {
      fontWeight: 500,
      fontSize: "13px",
      lineHeight: 1.6,

      color:
        mode === "dark"
          ? "#cbd5e1"
          : "#334155",
    },

    caption: {
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: 1.5,

      color:
        mode === "dark"
          ? "#94a3b8"
          : "#64748b",
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
      fontSize: "14px",
    },
  },

  shape: {
    borderRadius: 16,
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",

          border:
            mode === "dark"
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid rgba(15,23,42,0.08)",

          boxShadow:
            mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.35)"
              : "0 8px 24px rgba(15,23,42,0.08)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,

          border:
            mode === "dark"
              ? "1px solid rgba(255,255,255,0.06)"
              : "1px solid #dbe4ee",

          background:
            mode === "dark"
              ? "#0f172a"
              : "#ffffff",

          boxShadow:
            mode === "dark"
              ? "0 8px 24px rgba(0,0,0,0.35)"
              : "0 8px 24px rgba(15,23,42,0.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,

          padding:
            "10px 18px",

          fontWeight: 700,

          boxShadow: "none",

          transition:
            "all 0.2s ease",

          "&:hover": {
            transform:
              "translateY(-1px)",

            boxShadow:
              mode === "dark"
                ? "0 6px 18px rgba(0,0,0,0.4)"
                : "0 6px 18px rgba(15,23,42,0.12)",
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,

          background:
            mode === "dark"
              ? "#111827"
              : "#ffffff",

          transition:
            "all 0.2s ease",

          "& .MuiOutlinedInput-notchedOutline":
            {
              borderColor:
                mode === "dark"
                  ? "#334155"
                  : "#cbd5e1",
            },

          "&:hover .MuiOutlinedInput-notchedOutline":
            {
              borderColor:
                "#0ea5e9",
            },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderColor:
                "#0ea5e9",

              borderWidth: "2px",
            },
        },

        input: {
          color:
            mode === "dark"
              ? "#f8fafc"
              : "#0f172a",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom:
            mode === "dark"
              ? "1px solid #1e293b"
              : "1px solid #e2e8f0",

          color:
            mode === "dark"
              ? "#f8fafc"
              : "#0f172a",
        },

        head: {
          background:
            mode === "dark"
              ? "#111827"
              : "#f8fafc",

          fontWeight: 700,
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor:
            mode === "dark"
              ? "#334155"
              : "#dbe4ee",
        },
      },
    },
  },
});