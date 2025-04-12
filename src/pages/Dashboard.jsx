import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-buttons">
        <button className="btn blue" onClick={() => navigate('/proyectos')}>
          + Nuevo Proyecto
        </button>
        <button className="btn gray">+ Invitar Persona</button>
      </div>

      <div className="card centered">
        <h3>Mis Proyectos</h3>
        <p>Aquí verás tus proyectos recientes o en curso.</p>
      </div>

      <hr className="separator" />

      <div className="card-row">
        <div className="card">
          <h4>Comentarios</h4>
          <p>Actividad reciente de tus proyectos.</p>
        </div>
        <div className="card">
          <h4>Otros Proyectos</h4>
          <p>Proyectos donde estás como colaborador.</p>
        </div>
      </div>

      <hr className="extra-separator" />

      <div className="card-row large">
        <div className="card large-card">
          <h4>Calendario</h4>
          <p>Eventos y fechas importantes.</p>
        </div>
        <div className="card large-card">
          <h4>Tus Asignaciones</h4>
          <p>Tareas asignadas a ti.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
