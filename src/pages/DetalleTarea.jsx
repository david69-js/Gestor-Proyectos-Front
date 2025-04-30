import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useApiData from '../hooks/useApiData';
import './Tareas.css';

function DetalleTareas() {
  const { authData } = useContext(AuthContext);
  const { projectId, tareaId } = useParams();
  const { data: tarea, loading, error } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`, 
    authData?.token
  );
  const navigate = useNavigate();

  const handleEliminar = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData?.token}`,
        },
      });
      if (response.ok) {
        alert('Tarea eliminada correctamente');
        navigate(`/proyectos/${projectId}`);
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (err) {
      alert('Error de conexión al eliminar la tarea');
    }
  };

  if (!tarea) {
    return false;
  }

  return (
    <div className="container">
      {loading && <p>Cargando tarea...</p>}
      {error && <p>{error}</p>}
      {tarea && (
        <div className='tareas-container'>
          <h1>{tarea.nombre_tarea}</h1>
          
          <div className="tarea-info">
            <p><strong>Proyecto:</strong> {tarea.nombre_proyecto}</p>
            <p><strong>Descripción:</strong> <div dangerouslySetInnerHTML={{ __html: tarea.descripcion }} /></p>
            <p><strong>Fecha de creación:</strong> {new Date(tarea.fecha_creacion).toLocaleDateString()}</p>
            <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> {tarea.estado_id}</p>
          </div>

          <button
            onClick={() => navigate(`/proyectos/${projectId}/tareas/${tareaId}/editar`)}
            style={{
              marginBottom: '1rem',
              marginRight: '1rem',
              background: '#2980b9',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Editar Tarea
          </button>
          
          <button 
            onClick={handleEliminar}
            style={{
              marginBottom: '1rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar Tarea
          </button>
        </div>
      )}
    </div>
  );
}

export default DetalleTareas;
