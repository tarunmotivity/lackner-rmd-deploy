import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Inter', sans-serif",

    h6: {
      fontWeight: 700,
      fontSize: "16px",
      color: "#111827"
    },

    body2: {
      fontWeight: 500,
      fontSize: "13px"
    },

    caption: {
      fontWeight: 500,
      fontSize: "12px",
      color: "#6b7280"
    }
  }
});

export default theme;