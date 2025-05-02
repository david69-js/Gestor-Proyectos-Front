import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import Calendario from '../components/MiCalendario';
import { AuthContext } from '../context/AuthContext.jsx'; 
import { useContext } from 'react';
import useApiData from '../hooks/useApiData';
import ProyectoCard from '../components/proyecto-card.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const { authData } = useContext(AuthContext);
  const { data: proyectos, loading, error } = useApiData('/projects', authData?.token);
  const rol = authData.user.rol;

  return (
    <div className="dashboard-container container">
      {/* Botones superiores */}
      {rol === 'admin' && (
        <div className="dashboard-buttons mb-3">
          <button className="btn btn-primary me-2" onClick={() => navigate('/proyectos')}>
            + Nuevo Proyecto
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/invitar-persona')}>
            + Invitar Persona
          </button>
        </div>
      )}

      {/* Card clickeable de Mis Proyectos */}
      <div className="card centered clickable mb-3">
        <div className="card-body">
          <h3 className="card-title">Mis Proyectos</h3>
          {loading && <p>Cargando proyectos...</p>}
          {error && <p>Error al cargar proyectos</p>}
          {!loading && !error && proyectos && (
            <div className="row">
              {proyectos?.map((proyecto) => (
                <div className="col-md-4 mb-3" key={proyecto?.id || proyecto?._id}>
                  <ProyectoCard proyecto={proyecto} rol={rol} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="separator" />

      {/* Cards Comentarios y Otros Proyectos */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="card clickable" onClick={() => navigate('/proyectos')}>
            <div className="card-body">
              <h4 className="card-title">Comentarios</h4>
              <p className="card-text">Actividad reciente de tus proyectos.</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card clickable" onClick={() => navigate('/proyectos')}>
            <div className="card-body">
              <h4 className="card-title">Otros Proyectos</h4>
              <p className="card-text">Proyectos donde estás como colaborador.</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="extra-separator" />

      {/* Cards Calendario y Asignaciones */}
      <div className="row">
        <div className="col-md-6">
          <div className="card large-card">
            <div className="card-body">
              <h4 className="card-title">Calendario</h4>
              <Calendario />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card large-card clickable" onClick={() => navigate('/tareas')}>
            <div className="card-body">
              <h4 className="card-title">Tus Asignaciones</h4>
              <p className="card-text">Tareas asignadas a ti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;