import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tareas from './pages/Tareas';
import EditarTarea from './pages/EditarTarea';
import DetalleTareas from './pages/DetalleTarea';
import Proyectos from './pages/Proyectos';
import EditarProyecto from './pages/EditarProyecto.jsx';
import Registro from './pages/Registro';
import Perfil from './pages/Perfil'; // Asegúrate que el nombre del archivo coincide (mayúsculas)
import InvitarPersona from './pages/InvitarPersona';
import { AuthProvider } from './context/AuthContext.jsx';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext.jsx';
import ProyectoDetalle from './pages/ProyectoDetalle';

// Componente para las rutas protegidas y públicas
function LayoutWrapper() {
  const location = useLocation();
  const { authData } = useContext(AuthContext);
  const publicRoutes = ['/login', '/registro'];

  const ProtectedRoute = ({ children }) => {
    if (authData.isLoading) {
      return <div>Cargando...</div>;
    }
    return authData.isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ children }) => {
    if (authData.isLoading) {
      return <div>Cargando...</div>;
    }
    return !authData.isAuthenticated ? children : <Navigate to="/" replace />;
  };

  return (
    <>
      {/* Header solo se muestra en rutas no públicas */}
      {!publicRoutes.includes(location.pathname) && !authData.isLoading && <Header />}
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proyectos/:projectId/crear-tarea"
          element={
            <ProtectedRoute>
              <Tareas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:projectId/tareas/:tareaId/editar"
          element={
            <ProtectedRoute>
              <EditarTarea />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:projectId/detalle-tarea/:tareaId"
          element={
            <ProtectedRoute>
              <DetalleTareas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proyectos"
          element={
            <ProtectedRoute>
              <Proyectos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:projectId"
          element={
            <ProtectedRoute>
              <ProyectoDetalle />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proyectos/:projectId/editar"
          element={
            <ProtectedRoute>
              <EditarProyecto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil user={authData.user} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invitar-persona"
          element={
            <ProtectedRoute>
              <InvitarPersona />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 opcional */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
