import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import useApiData from '../hooks/useApiData';
import { AuthContext } from '../context/AuthContext.jsx';
import TareasProyecto from '../components/TareasProyecto';

function ProyectoDetalle() {
  const { id } = useParams();
  const { authData } = useContext(AuthContext);
  const { data: proyecto, loading, error } = useApiData(`/projects/${id}`, authData?.token);

  return (
    <div className='container'>
     
      {loading && <p>Cargando proyecto...</p>}
      {error && <p>Error al cargar el proyecto</p>}
      {!loading && !error && proyecto && (
        <div>
          <h1>{proyecto.nombre_proyecto}</h1>
          <div className="proyecto-descripcion">
            <div
              className="descripcion-html"
              dangerouslySetInnerHTML={{ __html: proyecto.descripcion }}
            />
          <p>
            <strong>Fecha de fin:</strong>{" "}
            {proyecto.fecha_fin
              ? new Date(proyecto.fecha_fin).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : ""}
          </p>
          </div>
          {/* Renderiza las tareas del proyecto usando el nuevo componente */}
          <TareasProyecto projectId={id} />
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;