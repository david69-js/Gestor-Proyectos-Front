import './proyecto-card.css';
import { useNavigate } from 'react-router-dom';

function ProyectoCard({ proyecto }) {
  const navigate = useNavigate();

  return (
    <div
      className="proyecto-card"
      aria-label={`Ver proyecto ${proyecto.nombre_proyecto}`}
      onClick={() => navigate(`/proyectos/${proyecto.id || proyecto._id}`)}
      tabIndex={0}
    >
      <h4>{proyecto.nombre_proyecto}</h4>
      <span className="ver-proyecto-link">Ver proyecto</span>
    </div>
  );
}

export default ProyectoCard;
  