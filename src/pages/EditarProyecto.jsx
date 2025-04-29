import React from 'react';
import { useParams } from 'react-router-dom';

function EditarProyecto() {
  const { id } = useParams();

  // Aquí puedes implementar el formulario de edición usando el id del proyecto
  return (
    <div className="container">
      <h2>Editar Proyecto</h2>
      <p>Formulario para editar el proyecto con ID: {id}</p>
      {/* Aquí va el formulario de edición */}
    </div>
  );
}

export default EditarProyecto;