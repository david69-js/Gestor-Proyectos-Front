import './proyecto-card.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalRedirect from './ModalRedirect';

function ProyectoCard({ proyecto }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleEliminar = async (e) => {
    e.stopPropagation();
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${proyecto.id || proyecto._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setShowModal(true);
      }
     
    } catch (err) {
     
    }
  };

  return (
    <>
      {showModal && (
        <ModalRedirect
          mensaje="Proyecto eliminado correctamente"
          redireccion="/dashboard"
          segundos={2}
        />
      )}
      <div
        className="proyecto-card"
        aria-label={`Ver proyecto ${proyecto.nombre_proyecto}`}
        onClick={() => navigate(`/proyectos/${proyecto.id || proyecto._id}`)}
        tabIndex={0}
      >
        <h4>{proyecto.nombre_proyecto}</h4>
        <span className="ver-proyecto-link">Ver proyecto</span>
        <button
          onClick={handleEliminar}
          style={{
            marginTop: '0.5rem',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '0.3rem 0.7rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Eliminar
        </button>
      </div>
    </>
  );
}

export default ProyectoCard;
  