import { useState, useEffect } from 'react';
import useUpdateApi from '../hooks/useUpdateApi'; // Importa el hook
import ModalRedirect from '../components/ModalRedirect'; // Importa el componente ModalRedirect
import './Perfil.css';

function Perfil({ user }) {
  const [usuario, setUsuario] = useState({
    nombre: '',
    imagen_perfil: '',
    numero_telefono: '',
    fecha_nacimiento: ''
  });

  const { data, loading, error, updateData } = useUpdateApi('/users/update-user', localStorage.getItem('authToken'));
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal

  useEffect(() => {
    setUsuario(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen_perfil' && files.length > 0) {
      const file = files[0];
      setUsuario({ ...usuario, imagen_perfil: file });
      // Vista previa de la imagen
      const imagePreview = URL.createObjectURL(file);
      setUsuario((prevState) => ({ ...prevState, imagen_previa: imagePreview }));
    } else {
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleGuardar = async () => {
    const formData = new FormData();
    formData.append('nombre', usuario.nombre);
    formData.append('numero_telefono', usuario.numero_telefono);
    formData.append('fecha_nacimiento', usuario.fecha_nacimiento);
    if (usuario.imagen_perfil) {
      formData.append('imagen_perfil', usuario.imagen_perfil);
    }

    const result = await updateData(formData);
    if (result) {
      setShowModal(true); // Muestra el modal si la actualización es exitosa
    }
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>

      {usuario.imagen_previa && (
        <img src={usuario.imagen_previa} alt="Perfil" className="imagen-perfil" />
      )}
      <label htmlFor="imagen_perfil">Imagen de perfil</label>
      <input type="file" name="imagen_perfil" onChange={handleChange} />
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
        value={usuario.fecha_nacimiento}
        onChange={handleChange}
      />

      <button onClick={handleGuardar} disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
      {error && <p className="error">Error al guardar los cambios</p>}
      {data && <p className="success">Cambios guardados correctamente</p>}

      {showModal && (
        <ModalRedirect
          mensaje="Perfil actualizado correctamente"
          redireccion={null} // No redirigir
          textoBoton="Cerrar"
        />
      )}
    </div>
  );
}

export default Perfil;