// pages/EquipoDetalle.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import './EquipoDetalle.css';

const mockEquipos = [
  {
    nombre: 'Equipo Alpha',
    empresa: 'Empresa A',
    usuarios: ['Ana', 'Luis', 'Carlos'],
    archivos: ['documento1.pdf', 'plan-trabajo.docx'],
    anuncios: ['Reunión el lunes', 'Entregar informe antes del viernes'],
  },
  {
    nombre: 'Equipo Beta',
    empresa: 'Empresa B',
    usuarios: ['Marta', 'Pedro'],
    archivos: ['presentacion.pptx'],
    anuncios: ['Actualizar cronograma', 'Nueva asignación de tareas'],
  },
];

function EquipoDetalle() {
  const { id } = useParams();
  const equipo = mockEquipos[id];

  if (!equipo) return <p>Equipo no encontrado.</p>;

  return (
    <div className="equipo-detalle-container">
      <div className="equipo-detalle-card">
        <h2>{equipo.nombre}</h2>
        <p><strong>Empresa:</strong> {equipo.empresa}</p>

        <div className="seccion">
          <h3>Usuarios</h3>
          <ul>
            {equipo.usuarios.map((usuario, idx) => (
              <li key={idx}>{usuario}</li>
            ))}
          </ul>
        </div>

        <div className="seccion">
          <h3>Archivos</h3>
          <ul>
            {equipo.archivos.map((archivo, idx) => (
              <li key={idx}>{archivo}</li>
            ))}
          </ul>
        </div>

        <div className="seccion">
          <h3>Anuncios</h3>
          <ul>
            {equipo.anuncios.map((anuncio, idx) => (
              <li key={idx}>📌 {anuncio}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default EquipoDetalle;
