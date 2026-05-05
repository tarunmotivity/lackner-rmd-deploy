import { RmdProvider } from "./context/RmdContext";
import { CustomThemeProvider, useThemeContext } from "./context/ThemeContext";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { getDesignTokens } from "./theme";
import Calculator from "./pages/Calculator";

const AppContent = () => {
  const { mode } = useThemeContext();
  const muiTheme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <RmdProvider>
        <Calculator />
      </RmdProvider>
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <CustomThemeProvider>
      <AppContent />
    </CustomThemeProvider>
  );
}

export default App;