import './proyecto-card.css';
import { useNavigate } from 'react-router-dom';

function ProyectoCard({ proyecto }) {
  const navigate = useNavigate();


  return (
    <>
      <div
        className="card proyecto-card bg-light text-dark"
        aria-label={`Ver proyecto ${proyecto.nombre_proyecto}`}
        onClick={() => navigate(`/proyectos/${proyecto.id || proyecto._id}`)}
        tabIndex={0}
      >
        <div className="card-body card-body-flex">
          <h4 className="card-title">{proyecto.nombre_proyecto}</h4>
        </div>
      </div>
    </>
  );
}

export default ProyectoCard;
  