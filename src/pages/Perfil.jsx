import { useState, useEffect } from 'react';
import useUpdateApi from '../hooks/hookform'; // Importa el hook
import ModalRedirect from '../components/ModalRedirect'; // Importa el componente ModalRedirect
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Perfil.css';

function Perfil({ user }) {
  const { authData } = useContext(AuthContext);
  const [usuario, setUsuario] = useState({
    nombre: '',
    imagen_perfil: '',
    imagen_previa: '',
    numero_telefono: '',
    fecha_nacimiento: ''
  });

  const { data, loading, error, updateData } = useUpdateApi('/users/update-user', authData?.token);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUsuario(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen_perfil' && files.length > 0) {
      const file = files[0];
      setUsuario((prevState) => ({
        ...prevState,
        imagen_perfil: file,  // GUARDAMOS EL ARCHIVO COMPLETO aquí
        imagen_previa: URL.createObjectURL(file) // Crear una URL para la previsualización
      }));
    } else {
      setUsuario((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleGuardar = async () => {
    const formData = new FormData();
    formData.append('nombre', usuario.nombre);
    formData.append('numero_telefono', usuario.numero_telefono);
    formData.append('fecha_nacimiento', usuario.fecha_nacimiento);
    
    // Verifica si se seleccionó una imagen, si no, asigna `null`
    if (usuario.imagen_perfil) {
      formData.append('imagen_perfil', usuario.imagen_perfil);
    } else {
      formData.append('imagen_perfil', null); // Aquí asignamos `null` si no se seleccionó ninguna imagen
    }
  
    await updateData(formData);
    console.log(data, loading);
  };
  

  const isButtonDisabled = () => {
    // Comparamos los valores actuales con los iniciales
    return (
      usuario.nombre === user.nombre &&
      usuario.imagen_perfil === user.imagen_perfil &&
      usuario.numero_telefono === user.numero_telefono &&
      usuario.fecha_nacimiento === user.fecha_nacimiento
    );
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>
      {usuario.imagen_previa ? (
        <img src={usuario.imagen_previa} alt="Vista Previa" className="imagen-perfil" />
      ) : (
        <img src={usuario.imagen_perfil} alt="Perfil" className="imagen-perfil" />
      )}
      
      <label htmlFor="imagen_perfil">Imagen de perfil</label>
      <input 
        type="file" 
        name="imagen_perfil" 
        accept="image/*" 
        onChange={handleChange} 
      />
      
      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        value={usuario.nombre}
        placeholder="Nombre"
        onChange={handleChange}
      />

      <label htmlFor="correo">Correo</label>
      <input
        type="email"
        name="correo"
        value={usuario.correo}
        disabled
        placeholder="Correo"
      />

      <label htmlFor="numero_telefono">Número de teléfono</label>
      <input
        type="text"
        name="numero_telefono"
        value={usuario.numero_telefono}
        placeholder="Número de teléfono"
        onChange={handleChange}
      />

      <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
      <input
        type="date"
        name="fecha_nacimiento"
        value={usuario.fecha_nacimiento.split('T')[0] || ''} // Manejar fecha en formato correcto
        onChange={handleChange}
      />

      <button 
        onClick={handleGuardar} 
        disabled={loading || isButtonDisabled()}
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>

      {error && <p className="error">Error al guardar los cambios</p>}
      {data && <p className="success">Cambios guardados correctamente</p>}

      {showModal && (
        <ModalRedirect
          mensaje="Perfil actualizado correctamente"
          redireccion={console.log('Listo')}
          textoBoton="Cerrar"
        />
      )}
    </div>
  );
}

export default Perfil;
