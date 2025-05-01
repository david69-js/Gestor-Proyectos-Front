import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useApiData from '../hooks/useApiData';
import axios from 'axios';
import './Tareas.css';


function DetalleTareas() {
  const { authData } = useContext(AuthContext);
  const { projectId, tareaId } = useParams();
  const [ usuariosAsignados, setUsuariosAsignados ] = useState([]);
  const navigate = useNavigate();

  const [isTaskUsersOpen, setTaskUsersOpen] = useState(false);
  const [isOrganizationUsersOpen, setOrganizationUsersOpen] = useState(false);

  // Obtener tarea
  const { data: tarea, loading: loadingTarea, error: errorTarea, refetch } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    authData?.token
  );

  // Obtener usuarios del proyecto
  const { data: usuarios, loading: loadingUsuarios, error: errorUsuarios } = useApiData(
    `/projects/${projectId}/project-participants`,
    authData?.token
  );

  const handleAsignarUsuarios = async (userId) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}/usuario/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`
        }
      });
      if (response.status === 201) {
        console.log(`Usuario ${userId} asignado`);
        refetch();
      }
    } catch (error) {
      console.error('Error al asignar usuario', error);
    }
  };

  const handleDesAsignarUsuarios = async (userId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`
        }
      });
      if (response.status === 200) {
        console.log(`Usuario ${userId} desasignado`);
        // Actualiza el estado de usuariosAsignados eliminando el usuario desasignado
        setUsuariosAsignados(prevUsuarios => prevUsuarios.filter(usuario => usuario.usuario_id !== userId));
        refetch(); // Refresca los datos de la tarea
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (tarea?.usuarios_asignados != undefined || tarea?.usuarios_asignados != null) {
      setUsuariosAsignados(JSON.parse(tarea.usuarios_asignados));
    }
  }, [tarea]);

  return (
    <div className="container">
      {loadingTarea && <p>Cargando tarea...</p>}
      {errorTarea && <p>Error al cargar la tarea</p>}
      {!loadingTarea && !errorTarea && tarea && (
        <div>
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
              <div className='container-usuarios'>
                <div className="usuarios-lista">
                  <button onClick={() => setTaskUsersOpen(!isTaskUsersOpen)} style={{ cursor: 'pointer' }}>
                    Asignados
                  </button>
                  <div className="container-asignados">
                    {isTaskUsersOpen && (
                      <>
                        {loadingUsuarios && <p>Cargando usuarios...</p>}
                        {errorUsuarios && <p>Error al cargar los usuarios</p>}
                        {!loadingUsuarios && !errorUsuarios && usuariosAsignados.map(usuario => (
                          <button
                            key={usuario.usuario_id}
                            onClick={() => handleDesAsignarUsuarios(usuario.usuario_id)}
                            className="button button-user"
                          >
                      
                            { authData.user.id === usuario.usuario_id ?  'Yo '+ usuario.nombre  : usuario.nombre}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="usuarios-lista sin-asignar">
                  <button onClick={() => setOrganizationUsersOpen(!isOrganizationUsersOpen)} style={{ cursor: 'pointer' }}>
                    Asignar personas
                  </button>
                  {isOrganizationUsersOpen && (
                    <>
                      {loadingUsuarios && <p>Cargando usuarios...</p>}
                      {errorUsuarios && <p>Error al cargar los usuarios</p>}
                      {!loadingUsuarios && !errorUsuarios && usuarios
                        .filter(usuario => 
                          !usuariosAsignados.some(asignado => asignado.usuario_id === usuario.usuario_id)
                        )
                        .map(usuario => (
                          <button
                            key={usuario.usuario_id}
                            onClick={() => handleAsignarUsuarios(usuario.usuario_id)}
                            className="button button-user"
                          >
                            { authData.user.id === usuario.usuario_id ?  'Yo '+ usuario.usuario_nombre  : usuario.usuario_nombre}
                          </button>
                        ))}

                    </>
                  )}
                </div>
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
      )}
    </div>
  );
}

export default DetalleTareas;
