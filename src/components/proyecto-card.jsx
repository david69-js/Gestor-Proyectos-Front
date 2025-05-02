import './proyecto-card.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ModalRedirect from './ModalRedirect';

function ProyectoCard({ proyecto, rol }) {
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
        className="card proyecto-card bg-secondary text-dark"
        aria-label={`Ver proyecto ${proyecto.nombre_proyecto}`}
        onClick={() => navigate(`/proyectos/${proyecto.id || proyecto._id}`)}
        tabIndex={0}
      >
        <div className="card-body">
          <h4 className="card-title">{proyecto.nombre_proyecto}</h4>
          <span className="card-text ver-proyecto-link">Ver proyecto</span>
          {rol === 'admin' && (
            <button
              onClick={handleEliminar}
              className="btn btn-danger mt-2"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default ProyectoCard;
  