import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useApiData from '../hooks/useApiData';
import './Tareas.css';

function Tareas() {
  const { authData } = useContext(AuthContext);
  const { projectId, tareaId } = useParams();
  const { data: tarea, loading, error } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`, 
    authData?.token
  );

  if (!tarea) {
    return false;
  }

  return (
    
    <div className="tareas-container">
      <h2>Detalle de la Tarea</h2>
      {loading && <p>Cargando tarea...</p>}
      {error && <p>{error}</p>}
      {tarea && (
        <div className="task-card">
          <h4>{tarea.nombre_tarea}</h4>
          <p>Proyecto: {tarea.nombre_proyecto}</p>
          <p>Descripción: {tarea.descripcion}</p>
          <p>Fecha de creación: {new Date(tarea.fecha_creacion).toLocaleDateString()}</p>
          <p>Fecha límite: {new Date(tarea.fecha_limite).toLocaleDateString()}</p>
          <p>Estado: {tarea.estado_id}</p>

        </div>
      )}
    </div>
  );
}

export default Tareas;
