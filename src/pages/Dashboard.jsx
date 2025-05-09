import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import Calendario from '../components/MiCalendario';
import { AuthContext } from '../context/AuthContext.jsx';
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
        <div className="dashboard-buttons d-flex flex-wrap justify-content-center mb-4">
          <button
            className="btn btn-primary mb-2 me-md-2"
            onClick={() => navigate('/proyectos')}
          >
            + Nuevo Proyecto
          </button>
          <button
            className="btn btn-secondary mb-2"
            onClick={() => navigate('/invitar-persona')}
          >
            + Invitar Persona
          </button>
        </div>
      )}

      {/* Mis Proyectos */}
      <div className="card centered clickable mb-4">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Mis Proyectos</h3>
          {loading && <p className="text-center">Cargando proyectos...</p>}
          {error && <p className="text-center text-danger">Error al cargar proyectos</p>}
          {!loading && !error && proyectos && (
            <div className="row">
              {proyectos.map((proyecto) => (
                <div
                  className="col-12 col-sm-6 col-md-4 mb-3"
                  key={proyecto?.id || proyecto?._id}
                >
                  <ProyectoCard proyecto={proyecto} rol={rol} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <hr className="separator" />

      {/* Calendario */}
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title text-center mb-3">Calendario</h4>
              <Calendario />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
