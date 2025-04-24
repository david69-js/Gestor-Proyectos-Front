import { useParams } from 'react-router-dom';

function ProyectoDetalle() {
  const { id } = useParams();

  // Aquí puedes hacer una petición para obtener los datos del proyecto usando el id

  return (
    <div>
      <h2>Detalle del Proyecto</h2>
      <p>ID del proyecto: {id}</p>
      {/* Aquí muestra más información del proyecto */}
    </div>
  );
}

export default ProyectoDetalle;