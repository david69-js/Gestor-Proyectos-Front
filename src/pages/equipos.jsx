import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Equipos.css';
import EquipoCard from '../components/EquipoCard';

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

function Equipos() {
  const navigate = useNavigate(); // Hook de navegación

  // Función para navegar a los detalles de un equipo
  const verDetalles = (id) => {
    navigate(`/equipos/${id}`);
  };

  return (
    <div className="equipos-page">
      <h2>Gestión de Equipos</h2>

      {/* Filtros y búsqueda (igual que antes) */}
      <div className="filtros">
        <select>
          <option>Empresa</option>
          <option>Empresa A</option>
          <option>Empresa B</option>
        </select>

        <select>
          <option>Empleado</option>
          <option>Ana</option>
          <option>Pedro</option>
        </select>

        <input type="date" />
        <input type="text" placeholder="Buscar equipo o usuario" />
        <button className="btn buscar">Buscar</button>
      </div>

      {/* Lista de equipos */}
      <div className="equipos-lista">
        {mockEquipos.map((equipo, index) => (
          <div key={index} className="equipo-card">
            <h3>{equipo.nombre}</h3>
            <button onClick={() => verDetalles(index)}>Ver detalles</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Equipos;
