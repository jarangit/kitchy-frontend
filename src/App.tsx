import Home from "./pages/home";
import { Toaster } from "sonner";


function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Home />
    </>
  );
}

export default App;
