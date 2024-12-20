import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/pages/home";  // Caminho incorreto ou mal resolvido
import TiposDeEventos from "./pages/TiposDeEventos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tiposdeeventos" element={<TiposDeEventos />} />
      </Routes>
    </Router>
  );
}

export default App;
