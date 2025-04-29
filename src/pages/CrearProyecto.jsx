import { useState, useEffect } from 'react';
import './CrearProyecto.css';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useParams } from 'react-router-dom';

function CrearProyecto() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      // Obtener la descripción actual del proyecto
      fetch(`${import.meta.env.VITE_API_URL}/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setDescripcion(data.descripcion || '');
        })
        .catch(err => console.error('Error al obtener la descripción:', err));
    }
  }, [id]);

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
          <CKEditor
            editor={ClassicEditor}
            data={descripcion}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescripcion(data);
            }}
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
