import React, { useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importar useNavigate
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
  const navigate = useNavigate(); // Instanciar useNavigate

  // Función para eliminar la tarea (similar a DetalleTarea.jsx)
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
        // Navegar de vuelta a la vista del proyecto después de eliminar
        navigate(`/proyectos/${projectId}`);
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (err) {
      alert('Error de conexión al eliminar la tarea');
    }
  };


  // Función para decodificar HTML (si la descripción puede contener HTML)
  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Renderizado condicional si la tarea no existe o no se encuentra
  if (loading) return <p>Cargando tarea...</p>;
  if (error) return <p>Error al cargar la tarea: {error.message || 'Error desconocido'}</p>;
  if (!tarea) return <p>Tarea no encontrada.</p>; // Manejo si la tarea es null o undefined después de cargar


  return (
    <div className="tareas-container container"> {/* Añadido container para consistencia */}
      {/* Mantenemos la carga y error por si acaso, aunque ya se manejan arriba */}
      {loading && <p>Cargando tarea...</p>}
      {error && <p>{error.message || 'Error desconocido'}</p>}
      {tarea && (
        <div> {/* Envolver en un div general */}
          <h1>{tarea.nombre_tarea}</h1>

          <div className="tarea-info"> {/* Clase para agrupar info */}
            <p><strong>Proyecto:</strong> {tarea.nombre_proyecto || 'No especificado'}</p>
            {/* Usar dangerouslySetInnerHTML si la descripción es HTML */}
            <p><strong>Descripción:</strong></p>
            <div dangerouslySetInnerHTML={{ __html: decodeHTML(tarea.descripcion) }} />
            <p><strong>Fecha de creación:</strong> {new Date(tarea.fecha_creacion).toLocaleDateString("es-ES")}</p>
            <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleDateString("es-ES")}</p>
            <p><strong>Estado:</strong> {tarea.estado_id !== undefined ? tarea.estado_id : 'No especificado'}</p> {/* Mejorar manejo de estado */}
          </div>

          {/* Botones de Acción */}
          <button
            onClick={() => navigate(`/proyectos/${projectId}/tareas/${tareaId}/editar`)} // Ruta de edición
            style={{
              marginBottom: '1rem',
              marginRight: '1rem',
              background: '#2980b9', // Azul
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
              background: '#e74c3c', // Rojo
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

export default Tareas;
