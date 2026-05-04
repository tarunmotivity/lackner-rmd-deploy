import { RmdProvider } from "./context/RmdContext";
import Calculator from "./pages/Calculator";

function App() {
  return (
    <RmdProvider>
      <Calculator />
    </RmdProvider>
  );
}

export default App;