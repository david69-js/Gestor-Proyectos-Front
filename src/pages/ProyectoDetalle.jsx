import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import useApiData from '../hooks/useApiData';
import { AuthContext } from '../context/AuthContext.jsx';
import TareasProyecto from '../components/TareasProyecto';
import { useNavigate } from 'react-router-dom';

function ProyectoDetalle() {
  const { id } = useParams();
  const { authData } = useContext(AuthContext);
  const { data: proyecto, loading, error } = useApiData(`/projects/${id}`, authData?.token);
  const navigate = useNavigate();

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Nueva función para eliminar el proyecto
  const handleEliminar = async () => {

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData?.token}`,
        },
      });
      if (response.ok) {
        alert('Proyecto eliminado correctamente');
        navigate('/proyectos');
      } else {
        alert('Error al eliminar el proyecto');
      }
    } catch (err) {
      alert('Error de conexión al eliminar el proyecto');
    }
  };

  return (
    <div className="container">
      {loading && <p>Cargando proyecto...</p>}
      {error && <p>Error al cargar el proyecto</p>}
      {!loading && !error && proyecto && (
        <div>
          <h1>{proyecto.nombre_proyecto}</h1>
          <div className="proyecto-descripcion">
            <strong>Descripción:</strong>
            {proyecto.descripcion && (
              <div dangerouslySetInnerHTML={{ __html: decodeHTML(proyecto.descripcion) }} />
            )}
          </div>
          <button
            onClick={() => navigate(`/proyectos/${id}/editar`)}
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
            Editar Proyecto
          </button>
          <button onClick={handleEliminar} style={{marginBottom: '1rem', background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer'}}>Eliminar proyecto</button>
          <button 
            onClick={() => navigate(`/proyectos/${id}/crear-tarea`)}
            style={{
              marginBottom: '1rem',
              marginLeft: '1rem',
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Crear Tarea
          </button>
          <p>
            <strong>Fecha de fin:</strong>{" "}
            {proyecto.fecha_fin
              ? new Date(proyecto.fecha_fin).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : "No especificada"}
          </p>
          <TareasProyecto projectId={id} />
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;
