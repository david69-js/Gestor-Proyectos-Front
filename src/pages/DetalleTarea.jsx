import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useApiData from '../hooks/useApiData';
import './Tareas.css';
import Select from 'react-select'; // Asegúrate de instalar react-select

function DetalleTareas() {
  const { authData } = useContext(AuthContext);
  const { projectId, tareaId } = useParams();
  const navigate = useNavigate();

  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [asignando, setAsignando] = useState(false);

  // Obtener tarea
  const { data: tarea, loading: loadingTarea, error: errorTarea } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    authData?.token
  );

  // Obtener usuarios del proyecto
  const { data: usuariosProyecto, loading: loadingUsuarios, error: errorUsuarios } = useApiData(
    `/projects/${projectId}/project-participants`,
    authData?.token
  );

  const handleAsignarUsuarios = async () => {
    console.log('Usuarios seleccionados:', usuariosSeleccionados);
    setAsignando(true);
  
    const usuariosParaAsignar = usuariosSeleccionados.filter(userId =>
      !usuariosAsignadosIds.includes(userId)
    );
    const usuariosParaDesasignar = usuariosAsignadosIds.filter(userId =>
      !usuariosSeleccionados.includes(userId)
    );
  
    console.log('Usuarios para asignar:', usuariosParaAsignar);
    console.log('Usuarios para desasignar:', usuariosParaDesasignar);
  
    try {
      const asignarPromises = usuariosParaAsignar.map(async userId => {
        console.log(`Asignando usuario con ID: ${userId}`);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/participants/${userId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authData?.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ usuario_id: userId })
        });
        const data = await response.json();
        console.log('Respuesta de asignación:', data);
      });
  
      const desasignarPromises = usuariosParaDesasignar.map(async userId => {
        console.log(`Desasignando usuario con ID: ${userId}`);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/projects/${projectId}/participants/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authData?.token}`
          }
        });
        const data = await response.json();
        console.log('Respuesta de desasignación:', data);
      });
  
      await Promise.all([...asignarPromises, ...desasignarPromises]);
  
      console.log('Usuarios actualizados correctamente');
    } catch (err) {
      console.error('Error al actualizar usuarios:', err);
    }
    setAsignando(false);
  };

  if (loadingTarea || loadingUsuarios) {
    return <p>Cargando datos...</p>;
  }

  if (errorTarea) {
    return <p>{`Error al cargar la tarea: ${errorTarea}`}</p>;
  }

  if (errorUsuarios) {
    return <p>{`Error al cargar usuarios: ${errorUsuarios}`}</p>;
  }

  // Parsear usuarios asignados
  let usuariosAsignados = [];
  try {
    usuariosAsignados = tarea.usuarios_asignados ? JSON.parse(tarea.usuarios_asignados) : [];
  } catch (e) {
    usuariosAsignados = [];
  }

  const usuariosAsignadosIds = usuariosAsignados.map(u => u.usuario_id);

  // Definir opciones para el componente Select
  const opcionesUsuarios = usuariosProyecto.map(usuario => ({
    value: usuario.usuario_id,
    label: usuario.usuario_nombre
  }));

  const handleSeleccionUsuario = (selectedOptions) => {
    const selectedIds = selectedOptions.map(option => option.value);
    setUsuariosSeleccionados(selectedIds);
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authData?.token}`,
        },
      });
      if (response.ok) {
        console.log(response)
        navigate(`/proyectos/${projectId}`);
      } else {
        alert('Error al eliminar la tarea');
      }
    } catch (err) {
      console.error('Error de conexión al eliminar la tarea:', err);
      alert('Error de conexión al eliminar la tarea');
    }
  };

  return (
    <div className="container">
      <h1>{tarea.nombre_tarea}</h1>
      <p><strong>Proyecto:</strong> {tarea.nombre_proyecto}</p>
      <p><strong>Organización:</strong> {tarea.nombre_organizacion}</p>
      <div className="tarea-info">
        <div className='tarea-info-container'>
          <div>
            <strong>Descripción:</strong>
            <div dangerouslySetInnerHTML={{ __html: tarea.descripcion }} />
          </div>
          <p><strong>Fecha de creación:</strong> {new Date(tarea.fecha_creacion).toLocaleDateString()}</p>
          <p><strong>Fecha límite:</strong> {new Date(tarea.fecha_limite).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {tarea.estado_tarea}</p>
          <p>
            <strong>Asignados:</strong>{" "}
            {usuariosAsignados.length > 0
              ? usuariosAsignados.map(u => u.nombre).join(", ")
              : "Sin asignar"}
          </p>
          <div>
            <strong>Asignar usuarios:</strong>
            {loadingUsuarios && <p>Cargando usuarios...</p>}
            {errorUsuarios && <p>Error al cargar usuarios</p>}
            <Select
              isMulti
              options={opcionesUsuarios}
              onChange={handleSeleccionUsuario}
              value={opcionesUsuarios.filter(option => usuariosSeleccionados.includes(option.value))}
            />
            <button
              onClick={handleAsignarUsuarios}
              disabled={asignando || usuariosSeleccionados.length === 0}
              style={{
                marginBottom: '1rem',
                background: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {asignando ? 'Asignando...' : 'Asignar seleccionados'}
            </button>
          </div>
        </div>
        <div className='info-tarea-buttons'>
          <button
            onClick={() => navigate(`/proyectos/${projectId}/tareas/${tareaId}/editar`)}
            style={{
              marginBottom: '1rem',
              marginRight: '1rem',
              background: '#2980b9',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Editar Tarea
          </button>
          <button
            onClick={handleEliminar}
            style={{
              marginBottom: '1rem',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Eliminar Tarea
          </button>
        </div>
      </div>
    </div>
  );

  // Inicializar usuariosSeleccionados con los IDs de los usuarios asignados
  useEffect(() => {
    setUsuariosSeleccionados(usuariosAsignadosIds);
  }, [usuariosAsignadosIds]);
}

export default DetalleTareas;
