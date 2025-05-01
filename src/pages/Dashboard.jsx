import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Calendario from '../components/MiCalendario';
import { AuthContext } from '../context/AuthContext.jsx'; 
import { useContext } from 'react';
import useApiData from '../hooks/useApiData';
import ProyectoCard from '../components/proyecto-card.jsx';


function Dashboard() {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const { data: proyectos, loading, error, refetch } = useApiData('/projects', authData?.token);
  const rol = authData.user.rol;

  // Polling mechanism to refetch data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch(); // Assuming useApiData hook provides a refetch method
    }, 30000); // 30000 ms = 30 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [refetch]);

  return (
    <div className="dashboard-container container">
      {/* Botones superiores */}
       { rol === 'admin' &&
        <div className="dashboard-buttons">
          <button className="btn" onClick={() => navigate('/proyectos')}>
            + Nuevo Proyecto
          </button>
          <button className="btn" onClick={() => navigate('/invitar-persona')}>
            + Invitar Persona
          </button>
        </div>
        
      }

      {/* Card clickeable de Mis Proyectos */}
      <div
        className="card centered clickable"
        
      >
        <h3>Mis Proyectos</h3>
        {loading && <p>Cargando proyectos...</p>}
        {error && <p>Error al cargar proyectos</p>}
        {!loading && !error && proyectos && (
          <div className="proyectos-grid">
            {proyectos?.map((proyecto) => (
              <ProyectoCard key={proyecto?.id || proyecto?._id} proyecto={proyecto} rol={rol} />
            ))}
          </div>
        )}
      </div>

      <hr className="separator" />

      {/* Cards Comentarios y Otros Proyectos */}
      <div className="card-row">
        <div
          className="card clickable"
          onClick={() => navigate('/proyectos')}
        >
          <h4>Comentarios</h4>
          <p>Actividad reciente de tus proyectos.</p>
        </div>
        <div
          className="card clickable"
          onClick={() => navigate('/proyectos')}
        >
          <h4>Otros Proyectos</h4>
          <p>Proyectos donde estás como colaborador.</p>
        </div>
      </div>

      <hr className="extra-separator" />

      {/* Cards Calendario y Asignaciones */}
      <div className="card-row large">
        <div className="card large-card">
          <h4>Calendario</h4>
          <Calendario />
        </div>

        <div
          className="card large-card clickable"
          onClick={() => navigate('/tareas')}
        >
          <h4>Tus Asignaciones</h4>
          <p>Tareas asignadas a ti.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;