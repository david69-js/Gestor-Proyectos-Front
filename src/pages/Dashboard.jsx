import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Calendario from '../components/MiCalendario';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {/* Botones superiores */}
      <div className="dashboard-buttons">
        <button className="btn" onClick={() => navigate('/proyectos')}>
          + Nuevo Proyecto
        </button>
        <button className="btn" onClick={() => navigate('/invitar-persona')}>
          + Invitar Persona
        </button>
      </div>

      {/* Card clickeable de Mis Proyectos */}
      <div
        className="card centered clickable"
        onClick={() => navigate('/proyectos')}
      >
        <h3>Mis Proyectos</h3>
        <p>Aquí verás tus proyectos recientes o en curso.</p>
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