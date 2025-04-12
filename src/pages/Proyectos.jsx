import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Proyectos.css';

function Proyectos() {
  const navigate = useNavigate();

  return (
    <div className="proyectos-container">
      <button className="btn blue" onClick={() => navigate('/crear-proyecto')}>
        Crear Proyecto
      </button>

      <div className="proyectos-cards">
        <div className="proyecto-card">
          <h3>Proyecto 1</h3>
          <p>Descripción del proyecto 1</p>
        </div>
        <div className="proyecto-card">
          <h3>Proyecto 2</h3>
          <p>Descripción del proyecto 2</p>
        </div>
        <div className="proyecto-card">
          <h3>Proyecto 3</h3>
          <p>Descripción del proyecto 3</p>
        </div>
        {/* Puedes agregar más tarjetas de proyectos */}
      </div>
    </div>
  );
}

export default Proyectos;
