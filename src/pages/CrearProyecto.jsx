import { useState } from 'react';
import './CrearProyecto.css';

function CrearProyecto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevoProyecto = {
      nombre_proyecto: nombre,
      descripcion,
      fecha_fin: fechaFin,
    };

    // Retornar el objeto en la consola
    console.log({
      proyecto: nuevoProyecto,
      estado: { nombre, descripcion, fechaFin },
    });

    // Aquí iría la petición al backend
  };

  return (
    <div className="crear-proyecto-container">
      <h2>Crear Proyecto</h2>
      <form className="formulario-proyecto" onSubmit={handleSubmit}>
        <label>
          Nombre del Proyecto:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={4}
            required
          />
        </label>

        <label>
          Fecha de Fin:
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-crear">Crear Proyecto</button>
      </form>
    </div>
  );
}

export default CrearProyecto;
