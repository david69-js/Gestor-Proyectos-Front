import './Tareas.css';

function Tareas() {
  
  const tareas = [
    {
      id: 1,
      nombre_tarea: 'Diseñar landing page',
      descripcion: 'Crear una propuesta visual para la página principal.',
      fecha_creacion: '2025-04-10',
      fecha_limite: '2025-04-20',
      estado: 'En progreso',
      proyecto: 'Sitio Web Corporativo'
    },
    {
      id: 2,
      nombre_tarea: 'Base de datos usuarios',
      descripcion: 'Diseñar y normalizar las tablas de usuarios y roles.',
      fecha_creacion: '2025-04-05',
      fecha_limite: '2025-04-15',
      estado: 'Pendiente',
      proyecto: 'Backend General'
    },
  ];

  return (
    <div className="tareas-container">
      <h2>Mis Tareas</h2>
      <div className="tareas-lista">
        {tareas.map((tarea) => (
          <div key={tarea.id} className="tarea-card">
            <h3>{tarea.nombre_tarea}</h3>
            <p className="descripcion">{tarea.descripcion}</p>
            <div className="tarea-info">
              <span><strong>Proyecto:</strong> {tarea.proyecto}</span>
              <span><strong>Estado:</strong> {tarea.estado}</span>
              <span><strong>Creada:</strong> {tarea.fecha_creacion}</span>
              <span><strong>Límite:</strong> {tarea.fecha_limite}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tareas;
