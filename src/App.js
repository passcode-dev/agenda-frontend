import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/pages/home";  // Caminho incorreto ou mal resolvido
import Alunos from "./pages/Alunos/Alunos";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/login" element={<Login />} />

      </Routes>
    </Router>
  );
}

export default App;
