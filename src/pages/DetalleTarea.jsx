import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import useApiData from '../hooks/useApiData';
import axios from 'axios';
import socket from '../hooks/socket'; // Importa el socket desde el archivo socket.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './Tareas.css';
import ComentariosList from '../components/ComentariosList';
import AgregarComentario from '../components/AgregarComentario';

function DetalleTareas() {
  const { authData } = useContext(AuthContext);
  const { projectId, tareaId } = useParams();
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [isTaskUsersOpen, setTaskUsersOpen] = useState(false);
  const [isOrganizationUsersOpen, setOrganizationUsersOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: tarea,
    loading: loadingTarea,
    error: errorTarea,
  } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    authData?.token
  );

  const {
    data: usuarios,
    loading: loadingUsuarios,
    error: errorUsuarios,
  } = useApiData(
    `/projects/${projectId}/project-participants`,
    authData?.token
  );

  const {
    data: dataComentarios,
    loading: loadingComentarios,
    error: errorComentarios,
  } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}/comentarios`,
    authData?.token
  );

  useEffect(() => {
    if (dataComentarios) {
      setComentarios(dataComentarios);
    }
  }, [dataComentarios]);

  useEffect(() => {
    // Usa el socket importado para escuchar eventos
    socket.on('connect', () => {
      console.log('Socket connected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
    
    socket.on('disconnect', (error) => {
      console.log('Socket disconnected', error);
    });

    return () => {
      socket.disconnect();
      console.log('Desconectado del servidor de WebSocket');
    };
  }, [authData]);

  const handleAsignarUsuarios = async (userId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}/usuario/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );
      if (response.status === 201) {
        console.log(`Usuario ${userId} asignado`);
      }
    } catch (error) {
      console.error('Error al asignar usuario', error);
    }
  };

  const handleDesAsignarUsuarios = async (userId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/tasks/project/${projectId}/tareas/${tareaId}/usuario/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData?.token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(`Usuario ${userId} desasignado`);
        setUsuariosAsignados((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.usuario_id !== userId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleComentarioAgregado = (nuevoComentario) => {
    setComentarios((prev) => [...prev, nuevoComentario]);
  };

  useEffect(() => {
    if (tarea?.usuariosAsignados) {
      try {
        setUsuariosAsignados(tarea?.usuariosAsignados);
      } catch (err) {
        console.error('Error al parsear usuarios asignados', err);
      }
    }
  }, [tarea]);

  return (
    <div className="container bg-light text-dark p-4 rounded shadow-sm">
      {loadingTarea && <p className="text-muted">Cargando tarea...</p>}
      {errorTarea && <p className="text-danger">Error al cargar la tarea</p>}
      {!loadingTarea && !errorTarea && tarea && (
        <div>
          <h1 className="mb-4">{tarea.nombre_tarea}</h1>
          <p>
            <strong>Proyecto:</strong> {tarea.nombre_proyecto}
          </p>
          <p>
            <strong>Organización:</strong> {tarea.nombre_organizacion}
          </p>
          <div className="tarea-info">
            <div className="tarea-info-container">
              <div
                className="bg-secondary text-white p-3 mb-3"
                style={{ overflow: 'auto', height: '50%' }}
              >
                <strong>Descripción:</strong>
                <div
                  dangerouslySetInnerHTML={{ __html: tarea.descripcion }}
                />
              </div>
              <p>
                <strong>Fecha de creación:</strong>{' '}
                {new Date(tarea.fecha_creacion).toLocaleDateString()}
              </p>
              <p>
                <strong>Fecha límite:</strong>{' '}
                {new Date(tarea.fecha_limite).toLocaleDateString()}
              </p>
              <p>
                <strong>Estado:</strong> {tarea.estado_tarea}
              </p>
              <div className="container-usuarios">
                <div className="dropdown usuarios-lista">
                  <button
                    onClick={() => setTaskUsersOpen(!isTaskUsersOpen)}
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                  >
                    Asignados
                  </button>
                  <ul
                    className={`dropdown-menu ${
                      isTaskUsersOpen ? 'show' : ''
                    }`}
                  >
                    {loadingUsuarios && (
                      <li className="dropdown-item">Cargando usuarios...</li>
                    )}
                    {errorUsuarios && (
                      <li className="dropdown-item">
                        Error al cargar los usuarios
                      </li>
                    )}
                    {!loadingUsuarios &&
                      !errorUsuarios &&
                      usuariosAsignados.map((usuario) => (
                        <li
                          key={usuario.usuario_id}
                          className="dropdown-item"
                        >
                          <button
                            onClick={() =>
                              handleDesAsignarUsuarios(usuario.usuario_id)
                            }
                            className="btn btn-outline-dark mt-1"
                          >
                            {authData.user.id === usuario.usuario_id
                              ? 'Yo ' + usuario.nombre
                              : usuario.nombre}
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="dropdown usuarios-lista sin-asignar">
                  <button
                    onClick={() =>
                      setOrganizationUsersOpen(!isOrganizationUsersOpen)
                    }
                    className="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                  >
                    Asignar personas
                  </button>
                  <ul
                    className={`dropdown-menu ${
                      isOrganizationUsersOpen ? 'show' : ''
                    }`}
                  >
                    {loadingUsuarios && (
                      <li className="dropdown-item">Cargando usuarios...</li>
                    )}
                    {errorUsuarios && (
                      <li className="dropdown-item">
                        Error al cargar los usuarios
                      </li>
                    )}
                    {!loadingUsuarios &&
                      !errorUsuarios &&
                      usuarios
                        .filter(
                          (usuario) =>
                            !usuariosAsignados.some(
                              (asignado) =>
                                asignado.usuario_id === usuario.usuario_id
                            )
                        )
                        .map((usuario) => (
                          <li
                            key={usuario.usuario_id}
                            className="dropdown-item"
                          >
                            <button
                              onClick={() =>
                                handleAsignarUsuarios(usuario.usuario_id)
                              }
                              className="btn btn-outline-dark mt-1"
                            >
                              {authData.user.id === usuario.usuario_id
                                ? 'Yo ' + usuario.usuario_nombre
                                : usuario.usuario_nombre}
                            </button>
                          </li>
                        ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="info-tarea-buttons">
              <button
                onClick={() =>
                  navigate(`/proyectos/${projectId}/tareas/${tareaId}/editar`)
                }
                className="btn btn-primary me-2"
              >
                Editar Tarea
              </button>
              <button className="btn btn-danger">Eliminar Tarea</button>
            </div>
          </div>
        </div>
      )}
      {loadingComentarios && <p>Cargando comentarios...</p>}
      {errorComentarios && (
        <p className="text-danger">Error al cargar comentarios</p>
      )}
      {!loadingComentarios && !errorComentarios && (
        <ComentariosList comentarios={comentarios} />
      )}
      <AgregarComentario
        projectId={projectId}
        tareaId={tareaId}
        onComentarioAgregado={handleComentarioAgregado}
        token={authData?.token}
      />
    </div>
  );
}

export default DetalleTareas;
