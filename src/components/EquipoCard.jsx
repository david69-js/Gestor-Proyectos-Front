// components/EquipoCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './EquipoCard.css';

function EquipoCard({ equipo, index }) {
  return (
    <div className="equipo-card">
      <h3>{equipo.nombre}</h3>
      <p><strong>Empresa:</strong> {equipo.empresa}</p>
      
      <div className="equipo-card-footer">
        <Link to={`/equipos/${index}`} className="btn-detalle">
          Ver detalles
        </Link>
      </div>
    </div>
  );
}

export default EquipoCard;
