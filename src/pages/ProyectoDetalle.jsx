import { useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import useApiData from '../hooks/useApiData';
import { AuthContext } from '../context/AuthContext.jsx';
import TareasProyecto from '../components/TareasProyecto';
import { useNavigate } from 'react-router-dom';
import useDeleteApi from '../hooks/useDeleteApi';
import axios from 'axios';
import './ProyectoDetalle.css'; // Importa el archivo CSS

function ProyectoDetalle() {
  const { projectId } = useParams();
  const { authData } = useContext(AuthContext);

  const { data: proyecto, loading, error, refetch } = useApiData(`/projects/${projectId}`, authData?.token);
  const { data: usuarios, loading: loadingUsuarios, error: errorUsuarios } = useApiData('/users/organization/users', authData?.token);
  const navigate = useNavigate();
  const { deleteData, loading: deleting, error: deleteError } = useDeleteApi(`/projects/${projectId}`, authData?.token);

  const [isProjectUsersOpen, setProjectUsersOpen] = useState(false);
  const [isOrganizationUsersOpen, setOrganizationUsersOpen] = useState(false);
  const [isClientesOpen, setClientesOpen] = useState(false);
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleEliminar = async () => {
    const response = await deleteData();
    if (response) {
      console.log(deleting);
      navigate('/proyectos');
    } else {
      console.log(deleteError);
    }
  };

  const handleAsignarUsuarios = async (userId) => {
    if (authData.user.rol !== 'admin' || authData.user.rol == 'colaborador') {
      console.error('Solo los administradores pueden asignar usuarios.');
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/${id}/participants/${userId}`, {}, {
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
    if (authData.user.rol !== 'admin' || authData.user.rol == 'colaborador') {
      console.error('Solo los administradores pueden desasignar usuarios.');
      return;
    }
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${projectId}/participants/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`
        }
      });
      if (response.status === 200) {
        console.log(`Usuario ${userId} desasignado`);
        refetch(); // Refresca los datos del proyecto
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // Este efecto se ejecutará cada vez que se actualicen los datos del proyecto
    console.log('Datos del proyecto actualizados');
  }, [proyecto]);

  return (
    <div className="container bg-light text-dark p-4 rounded shadow-sm">
      {loading && <p className="text-muted">Cargando proyecto...</p>}
      {error && <p className="text-danger">Error al cargar el proyecto</p>}
      {!loading && !error && proyecto && (
        <div>
          <h1 className="mb-4">{proyecto.nombre_proyecto}</h1>
          <div className="proyecto-descripcion mb-4">
            <div className='clientes mb-3'>
              <button onClick={() => setClientesOpen(!isClientesOpen)} className="btn btn-light card dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded={isClientesOpen}>
                <strong>Clientes:</strong>
              </button>
              <ul className={`dropdown-menu ${isClientesOpen ? 'show' : ''}`}>
                {usuarios.map(usuario => (
                  usuario.rol === 'cliente' && (
                    <li key={usuario.id_usuario} className="dropdown-item text-muted">
                      {usuario.nombre_usuario}
                    </li>
                  )
                ))}
              </ul>
            </div>
            <strong>Descripción:</strong>
            {proyecto.descripcion && (
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: decodeHTML(proyecto.descripcion) }} />
            )}
          </div>

          <div class="container flex-container px-4 text-center">
          
              {(authData.user.rol === 'admin' ) && (
                <>
                 
                      <button
                        onClick={() => navigate(`/proyectos/${projectId}/editar`)}
                        className="btn btn-light card"
                      >
                        Editar Proyecto
                      </button>
                 
                 
                    <button onClick={handleEliminar} className="btn btn-light card">Eliminar proyecto</button>
                 
                  </>
                )}
                       
                <button 
                  onClick={() => navigate(`/proyectos/${projectId}/crear-tarea`)}
                  className="btn btn-light card"
                >
                  Crear Tarea
                </button>

          </div>
          {authData.user.rol === 'admin' && (
            <div className='container-usuarios mt-4'>
              <div className="usuarios-lista mb-3">
                <div className="dropdown">
                  <button onClick={() => setProjectUsersOpen(!isProjectUsersOpen)} className="btn btn-light card dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Usuarios Asignados
                  </button>
                  <ul className={`dropdown-menu ${isProjectUsersOpen ? 'show' : ''}`}>
                    {loadingUsuarios && <li className="dropdown-item">Cargando usuarios...</li>}
                    {errorUsuarios && <li className="dropdown-item">Error al cargar los usuarios</li>}
                    {!loadingUsuarios && !errorUsuarios && proyecto.usuarios.map(usuario => (
                      usuario.rol_usuario !== 'admin' && authData.user.id !== usuario.id_usuario ? (
                        <li key={usuario.id_usuario} className="dropdown-item">
                          <button
                            onClick={() => handleDesAsignarUsuarios(usuario.id_usuario)}
                            className="btn btn-outline-dark"
                          >
                            {authData.user.id === usuario.id_usuario ? 'Yo ' + usuario.nombre_usuario : usuario.nombre_usuario}
                          </button>
                        </li>
                      ) : null
                    ))}
                  </ul>
                </div>
              </div>
              <div className="usuarios-lista sin-asignar">
                <div className="dropdown">
                  <button onClick={() => setOrganizationUsersOpen(!isOrganizationUsersOpen)} className="btn btn-light card dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Asignar Colaboradores
                  </button>
                  <ul className={`dropdown-menu ${isOrganizationUsersOpen ? 'show' : ''}`}>
                    {loadingUsuarios && <li className="dropdown-item">Cargando usuarios...</li>}
                    {errorUsuarios && <li className="dropdown-item">Error al cargar los usuarios</li>}
                    {!loadingUsuarios && !errorUsuarios && usuarios.filter(usuario => 
                      !proyecto.usuarios.some(asignado => asignado.id_usuario === usuario.id_usuario)
                    ).map(usuario => (
                      <li key={usuario.id} className="dropdown-item">
                        <button
                          onClick={() => handleAsignarUsuarios(usuario.id_usuario)}
                          className="btn btn-outline-dark"
                        >
                          { authData.user.id === usuario.id_usuario ?  'YO '+ usuario.nombre_usuario  : usuario.nombre_usuario}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
          <p className="mt-4">
            <strong>Fecha de fin:</strong>{" "}
            {proyecto.fecha_fin
              ? new Date(proyecto.fecha_fin).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : "No especificada"}
          </p>
          
          <TareasProyecto projectId={projectId} />
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;
