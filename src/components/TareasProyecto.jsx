import useApiData from '../hooks/useApiData';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import './TareasProyecto.css';

function TareasProyecto({ projectId }) {
  const { authData } = useContext(AuthContext);
  const { data: tareas, loading, error } = useApiData(
    `/tasks/project/${projectId}/tareas`,
    authData?.token
  );

  const categorias = [
    { key: 'por_hacer', label: 'Por hacer', className: 'por-hacer' },
    { key: 'en_progreso', label: 'En progreso', className: 'en-progreso' },
    { key: 'listo', label: 'Listo', className: 'listo' }
  ];

  const getTareasPorCategoria = (categoria) => {
    if (!tareas) return [];
    return tareas.filter(tarea => {
      // Normaliza el estado_tarea a minúsculas y sin espacios
      const estado = tarea.estado_tarea
        ? tarea.estado_tarea.toLowerCase().replace(/\s/g, '_')
        : 'por_hacer';
      return estado === categoria.key;
    });
  };

  return (
    <div>
      <h3>Tareas del Proyecto</h3>
      {loading && <p>Cargando tareas...</p>}
      {error && <p>Error al cargar las tareas</p>}
      {!loading && !error && tareas && tareas.length > 0 ? (
        <div className="tareas-board">
          {categorias.map((categoria) => (
            <div
              key={categoria.key}
              className={`tareas-columna ${categoria.className}`}
            >
              <h4>{categoria.label}</h4>
              {getTareasPorCategoria(categoria).length === 0 ? (
                <p>Sin tareas</p>
              ) : (
                getTareasPorCategoria(categoria).map((tarea) => (
                  <Link
                    className="task-card"
                    key={tarea.TareaId}
                    to={`/proyectos/${projectId}/detalle-tarea/${tarea.TareaId}`}
                  >
                    <h5>{tarea.nombre_tarea}</h5>
                
                    <p>
                      Asignada a: {tarea.usuarios_asignados ? tarea.usuarios_asignados : "Ninguno"}
                    </p>
                  </Link>
                ))
              )}
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No hay tareas para este proyecto.</p>
      )}
    </div>
  );
}

export default TareasProyecto;