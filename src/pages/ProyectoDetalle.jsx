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
  const { id } = useParams();
  const { authData } = useContext(AuthContext);

  const { data: proyecto, loading, error, refetch } = useApiData(`/projects/${id}`, authData?.token);
  const { data: usuarios, loading: loadingUsuarios, error: errorUsuarios } = useApiData('/users/organization/users', authData?.token);
  const navigate = useNavigate();
  const { deleteData, loading: deleting, error: deleteError } = useDeleteApi(`/projects/${id}`, authData?.token);

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
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}/participants/${userId}`, {
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
    <div className="container">
      {loading && <p>Cargando proyecto...</p>}
      {error && <p>Error al cargar el proyecto</p>}
      {!loading && !error && proyecto && (
        <div>
          <h1>{proyecto.nombre_proyecto}</h1>
          <div className="proyecto-descripcion">
          <div className='clientes'>
              <button onClick={() => setClientesOpen(!isClientesOpen)} style={{ cursor: 'pointer' }}>
              <strong>Clientes:</strong>
              </button>
              {isClientesOpen && (
                <div>
                  {usuarios.map(usuario => (
                    usuario.rol === 'cliente' && (
                      <div key={usuario.id_usuario}>
                        {usuario.nombre_usuario}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
            <strong>Descripción:</strong>
            {proyecto.descripcion && (
              <div dangerouslySetInnerHTML={{ __html: decodeHTML(proyecto.descripcion) }} />
            )}
          </div>
          {(authData.user.rol === 'admin' || authData.user.rol === 'colaborador') && (
            <>
              <button
                onClick={() => navigate(`/proyectos/${id}/editar`)}
                className="button button-edit"
              >
                Editar Proyecto
              </button>
              <button onClick={handleEliminar} className="button button-delete">Eliminar proyecto</button>
            </>
          )}
          <button 
            onClick={() => navigate(`/proyectos/${id}/crear-tarea`)}
            className="button button-create"
          >
            Crear Tarea
          </button>
          <div className='container-usuarios'>
            <div className="usuarios-lista">
              <button onClick={() => setProjectUsersOpen(!isProjectUsersOpen)} style={{ cursor: 'pointer' }}>
                Usuarios Asignados
              </button>
              <div className="container-asignados">
                {isProjectUsersOpen && (
                  <>
                    {loadingUsuarios && <p>Cargando usuarios...</p>}
                    {errorUsuarios && <p>Error al cargar los usuarios</p>}
                    {!loadingUsuarios && !errorUsuarios && proyecto.usuarios.map(usuario => (
                      usuario.rol_usuario !== 'admin' && authData.user.id !== usuario.id_usuario ? (
                        <button
                          key={usuario.id_usuario}
                          onClick={() => handleDesAsignarUsuarios(usuario.id_usuario)}
                          className="button button-user"
                        >
                          {authData.user.id === usuario.id_usuario ? 'Yo ' + usuario.nombre_usuario : usuario.nombre_usuario}
                        </button>
                      ) : null
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="usuarios-lista sin-asignar">
              <button onClick={() => setOrganizationUsersOpen(!isOrganizationUsersOpen)} style={{ cursor: 'pointer' }}>
                Asignar Colaboradores
              </button>
              {isOrganizationUsersOpen && (
                <>
                  {loadingUsuarios && <p>Cargando usuarios...</p>}
                  {errorUsuarios && <p>Error al cargar los usuarios</p>}
                  {!loadingUsuarios && !errorUsuarios && usuarios.filter(usuario => 
                    !proyecto.usuarios.some(asignado => asignado.id_usuario === usuario.id_usuario)
                  ).map(usuario => (
                    <button
                      key={usuario.id}
                      onClick={() => handleAsignarUsuarios(usuario.id_usuario)}
                      className="button button-user"
                    >
                      { authData.user.id === usuario.id_usuario ?  'YO '+ usuario.nombre_usuario  : usuario.nombre_usuario}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
          <p>
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
          
          <TareasProyecto projectId={id} />
        </div>
      )}
    </div>
  );
}

export default ProyectoDetalle;
