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
      <h2>Detalle del Proyecto</h2>
      <p>ID del proyecto: {id}</p>
      {loading && <p>Cargando proyecto...</p>}
      {error && <p>Error al cargar el proyecto</p>}
      {!loading && !error && proyecto && (
        <div>
          <p><strong>Nombre:</strong> {proyecto.nombre_proyecto}</p>
          <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
          <p><strong>Fecha de fin:</strong> {proyecto.fecha_fin}</p>
          {/* Renderiza las tareas del proyecto usando el nuevo componente */}
          <TareasProyecto projectId={id} />
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;