import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import Proyectos from './pages/Proyectos';
import CrearProyecto from './pages/CrearProyecto';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil';
import Equipos from './pages/equipos';
import EquipoDetalle from './pages/EquipoDetalle'; // <-- ✅ Nuevo import

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function LayoutWrapper() {
  const location = useLocation();
  const publicRoutes = ['/', '/login', '/registro'];

  return (
    <>
      {!publicRoutes.includes(location.pathname) && <Header />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/tareas" element={
          <ProtectedRoute>
            <Tareas />
          </ProtectedRoute>
        } />
        <Route path="/proyectos" element={
          <ProtectedRoute>
            <Proyectos />
          </ProtectedRoute>
        } />
        <Route path="/equipos" element={
          <ProtectedRoute>
            <Equipos />
          </ProtectedRoute>
        } />
        <Route path="/crear-proyecto" element={
          <ProtectedRoute>
            <CrearProyecto />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        } />
        <Route path="/equipos/:id" element={ // ✅ Nueva ruta
          <ProtectedRoute>
            <EquipoDetalle />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
