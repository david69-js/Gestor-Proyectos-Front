import React from 'react';
import './PerfilInfo.css';

function PerfilInfo({ usuario }) {
  if (!usuario) return <p>No hay datos de usuario disponibles.</p>;

  return (
    <div className="perfil-info-card">
      <div className="perfil-header">
        <div className="perfil-avatar-section">
        <div className="perfil-about-img">
             {
                 usuario.imagen_perfil ? 
                <img src={usuario.imagen_perfil} alt="about" />:
                <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="about" />
                    
            }
        </div>
          <div className="perfil-nombre">
            <h2>{usuario.nombre || "Sin nombre"}</h2>
            <span className="perfil-ubicacion">{usuario.correo}</span>
          </div>
        </div>
  
      </div>
      <div className="perfil-body">
        <p>
          {usuario.numero_telefono && <><strong>Teléfono:</strong> {usuario.numero_telefono}<br /></>}
          {usuario.fecha_nacimiento && <><strong>Fecha de nacimiento:</strong> {usuario.fecha_nacimiento}<br /></>}
          <strong>Registrado:</strong> {usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleString() : 'No proporcionada'}
        </p>
      </div>
    </div>
  );
}

export default PerfilInfo;