import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import Proyectos from './pages/Proyectos';
import CrearProyecto from './pages/CrearProyecto';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil'; // Asegúrate que el nombre del archivo coincide (mayúsculas)
import EquipoDetalle from './pages/EquipoDetalle';
import InvitarPersona from './pages/InvitarPersona';
import { AuthProvider } from './context/AuthContext.jsx'; // Import the AuthProvider
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx'; // Import the AuthContext
import ProyectoDetalle from './pages/ProyectoDetalle';

// Componente para las rutas protegidas

function LayoutWrapper() {
  const location = useLocation();
  const { authData } = useContext(AuthContext); // Use authData from context
  const publicRoutes = ['/', '/login', '/registro'];


  const ProtectedRoute = ({ children }) => {
    if (authData.isLoading) {
      return <div>Cargando...</div>;  // O algún componente de carga
    }

    return authData.isAuthenticated ? children : <Navigate to="/login" replace />;
  };
  
  return (
    <>
      {/* Header solo se muestra en rutas no públicas */}
      {!publicRoutes.includes(location.pathname) && <Header />}
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/tareas" element={<ProtectedRoute><Tareas /></ProtectedRoute>} />
        <Route path="/proyectos" element={<ProtectedRoute><Proyectos /></ProtectedRoute>} />
        <Route path="/proyectos/:id" element={<ProtectedRoute><ProyectoDetalle /></ProtectedRoute>} />
        <Route path="/proyectos/:projectId/tareas/:tareaId" element={<ProtectedRoute><Tareas /></ProtectedRoute>} />
        <Route path="/crear-proyecto" element={<ProtectedRoute><CrearProyecto /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/equipos/:id" element={<ProtectedRoute><EquipoDetalle /></ProtectedRoute>} />

        {/* Ruta para invitar persona - corregida */}
        <Route 
          path="/invitar-persona" 
          element={
           
              <InvitarPersona />
           
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
      <Router>
        <AuthProvider>
            <LayoutWrapper />
        </AuthProvider>
      </Router>
  );
}

export default App;