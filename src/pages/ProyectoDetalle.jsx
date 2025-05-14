import { useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import useApiData from '../hooks/useApiData';
import { AuthContext } from '../context/AuthContext.jsx';
import TareasProyecto from '../components/TareasProyecto';
import { useNavigate } from 'react-router-dom';
import useDeleteApi from '../hooks/useDeleteApi';
import axios from 'axios';
import './ProyectoDetalle.css'; // Importa el archivo CSS
import { obtenerReporteDelProyecto } from '../hooks/reportes.js';
import ReporteProyectos from '../components/Reporte.jsx';
import DescargarPDF from '../components/PDF.jsx';

function ProyectoDetalle() {
  const { projectId } = useParams();
  const { authData } = useContext(AuthContext);

  const { data: proyecto, loading, error, refetch } = useApiData(`/projects/${projectId}`, authData?.token);
  const { data: usuarios, loading: loadingUsuarios, error: errorUsuarios, refetch: refetchUsers } = useApiData('/users/organization/users', authData?.token);
  const navigate = useNavigate();
  const { deleteData, loading: deleting, error: deleteError } = useDeleteApi(`/projects/${projectId}`, authData?.token);
  const [usuariosAsignados, setUsuariosAsignados] = useState([]);
  const [isProjectUsersOpen, setProjectUsersOpen] = useState(false);
  const [isOrganizationUsersOpen, setOrganizationUsersOpen] = useState(false);
  const [isClientesOpen, setClientesOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/${projectId}/participants/${userId}`, {}, {
        headers: {
          'Authorization': `Bearer ${authData?.token}`
        }
      });
      if (response.status === 201) {
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
   
        refetch();
        setUsuariosAsignados((prevUsuarios) =>
          prevUsuarios.filter((usuario) => usuario.usuario_id !== userId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [reporte, setReporte] = useState(null);

  const generarReporte = async () => {
    const datosReporte = await obtenerReporteDelProyecto(authData, projectId);
    if (datosReporte) {
      setReporte(datosReporte);
    }
  };


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  
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
          <div className='clientes mb-3'>
                <strong>Clientes:</strong>
              <ul className="lista-clientes show">
                  {loadingUsuarios && <li className="dropdown-item">Cargando usuarios...</li>}
                  {errorUsuarios && <li className="dropdown-item">Error al cargar los usuarios</li>}
                  {!loadingUsuarios && !errorUsuarios && (
                    proyecto.usuarios.some(usuario => usuario.rol_usuario === 'cliente') ? (
                      proyecto.usuarios.map(usuario => (
                        usuario.rol_usuario === 'cliente' ? (
                          <li key={usuario.usuario_id} className="dropdown-item">
                            <button
                              onClick={() => handleDesAsignarUsuarios(usuario.usuario_id)}
                              className="btn btn-outline-dark"
                            >
                              {authData.user.id === usuario.usuario_id ? 'Yo ' + usuario.nombre : usuario.nombre}
                            </button>
                          </li>
                        ) : null
                      ))
                    ) : (
                      <li className="dropdown-item text-center">No hay clientes asignados</li>
                    )
                  )}
                </ul>
            </div>
          <div className="proyecto-descripcion mb-4">
            
            <strong>Descripción:</strong>
            {proyecto.descripcion && (
              <div className="mt-2" dangerouslySetInnerHTML={{ __html: decodeHTML(proyecto.descripcion) }} />
            )}
          </div>
<hr className='custom-separador'/>
          <div class="container flex-container px-4 text-center container-buttons">
          
              <div className="container-cta">
              {(authData.user.rol === 'admin' ) && (
                <>
                 
                      <button
                        onClick={() => navigate(`/proyectos/${projectId}/editar`)}
                        className="btn btn-darkbluecustom card"
                      >
                        Editar Proyecto
                      </button>
                 
                 
                    <button onClick={handleEliminar} className="btn btn-darkbluecustom card">Eliminar proyecto</button>
                 
                  </>
                )}
                       
                <button 
                  onClick={() => navigate(`/proyectos/${projectId}/crear-tarea`)}
                  className="btn btn-darkbluecustom card"
                >
                  Crear Tarea
                </button>
              </div>

              <hr className='custom-separador' />

                {authData.user.rol === 'admin' && (
            <div className='container-usuarios mt-4'>
              <div className="usuarios-lista mb-3">
                <div className="dropdown dropdown-custom">
                  <button onClick={() => setProjectUsersOpen(!isProjectUsersOpen)} className="btn btn-secondary card dropdown-toggle btn-custom" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Usuarios Asignados
                  </button>
                  <ul className={`dropdown-menu ${isProjectUsersOpen ? 'show' : ''}`}>
                    {loadingUsuarios && <li className="dropdown-item">Cargando usuarios...</li>}
                    {errorUsuarios && <li className="dropdown-item">Error al cargar los usuarios</li>}
                    {!loadingUsuarios && !errorUsuarios && proyecto.usuarios.map(usuario => (
                      usuario.rol_usuario !== 'admin' && authData.user.id !== usuario.usuario_id ? (
                        <li key={usuario.usuario_id} className="dropdown-item">
                          <button
                            onClick={() => handleDesAsignarUsuarios(usuario.usuario_id)}
                            className="btn btn-outline-dark"
                          >
                            {authData.user.id === usuario.usuario_id ? 'Yo ' + usuario.nombre : usuario.nombre}
                          </button>
                        </li>
                      ) : null
                    ))}
                  </ul>
                </div>
              </div>
              <div className="usuarios-lista sin-asignar">
                <div className="dropdown dropdown-custom">
                  <button onClick={() => setOrganizationUsersOpen(!isOrganizationUsersOpen)} className="btn btn-secondary card dropdown-toggle btn-custom" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Asignar Colaboradores
                  </button>
                  <ul className={`dropdown-menu ${isOrganizationUsersOpen ? 'show' : ''}`}>
                    {loadingUsuarios && <li className="dropdown-item">Cargando usuarios...</li>}
                    {errorUsuarios && <li className="dropdown-item">Error al cargar los usuarios</li>}
                    {!loadingUsuarios && !errorUsuarios && usuarios.filter(usuario => 
                      !proyecto.usuarios.some(asignado => asignado.usuario_id === usuario.usuario_id)
                    ).map(usuario => (
                      <li key={usuario.id} className="dropdown-item">
                        <button
                          onClick={() => handleAsignarUsuarios(usuario.usuario_id)}
                          className="btn btn-outline-dark"
                        >
                          { authData.user.id === usuario.usuario_id ?  'YO '+ usuario.nombre  : usuario.nombre}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <hr className='custom-separador'/>
          <button className="btn btn-info btn-report text-center justify-content-center align-items-center" onClick={generarReporte}>
            Generar Reporte del Proyecto
          </button>

          <div className='container-generate-report'>
            { reporte &&
            <>
               <button onClick={handleOpenModal} className="btn btn-primary justify-content-center align-items-center">Ver Reporte</button>
               <ReporteProyectos reporte={reporte} showModal={showModal} handleClose={handleCloseModal} />
              <DescargarPDF reporte={reporte} />
            </>
            }
          </div>
          </div>
          
        
          

          
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
