import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Proyectos.css';

function Proyectos() {
  const navigate = useNavigate();

  const handleEliminar = (id) => {
    console.log('Proyecto eliminado', id);
    // Aquí iría la lógica para eliminar el proyecto con ID `id`
  };

  const handleActualizar = (id) => {
    console.log('Proyecto actualizado', id);
    // Aquí iría la lógica para actualizar el proyecto con ID `id`
  };

  // Simulamos un proyecto con datos estáticos
  const fechaInicio = new Date('2025-04-01').toLocaleDateString();

  return (
    <div className="proyectos-container">
      <button className="btn blue" onClick={() => navigate('/crear-proyecto')}>
        Crear Proyecto
      </button>

      <div className="proyectos-cards">
        <div className="proyecto-card">
          <div className="card-header">
            <h3>Proyecto 1</h3>
            <p>Descripción del proyecto 1 — Inicio: {fechaInicio}</p>
          </div>

          <div className="sub-cards">

            {/* Ambas sub-cards redirigen a la misma página de InvitarPersona */}
            <div className="sub-card" onClick={() => navigate('/invitar-persona')}>
              <h4>Invitar Cliente</h4>
              <p>Invitar Cliente</p>
            </div>

            <div className="sub-card" onClick={() => navigate('/invitar-persona')}>
              <h4>Asignar Colaboradores</h4>
              <p>Colaboradores asignados: 3</p>
            </div>

          </div>

          <div className="actions">
            <button onClick={() => handleActualizar(1)}>Actualizar</button>
            <button onClick={() => handleEliminar(1)}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Proyectos;
