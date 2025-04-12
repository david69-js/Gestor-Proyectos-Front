import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import Proyectos from './pages/Proyectos';
import CrearProyecto from './pages/CrearProyecto'; // <-- ¡importa aquí!

function HeaderWithConditionalRendering() {
  const location = useLocation();
  if (location.pathname === "/") return null;
  return <Header />;
}

function App() {
  return (
    <Router>
      <HeaderWithConditionalRendering />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/crear-proyecto" element={<CrearProyecto />} /> {/* <-- y agrega esto */}
      </Routes>
    </Router>
  );
}

export default App;
