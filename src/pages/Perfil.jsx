import { useState, useEffect } from 'react';
import './Perfil.css';

function Perfil() {
  const [usuario, setUsuario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    imagen_perfil: '',
    numero_telefono: '',
    fecha_nacimiento: ''
  });

  useEffect(() => {
    // Simulación de obtener datos del usuario desde localStorage
    const datosGuardados = JSON.parse(localStorage.getItem('usuario')) || {
      nombre: 'Juan Pérez',
      correo: 'juan@example.com',
      contrasena: '******',
      imagen_perfil: '',
      numero_telefono: '1234567890',
      fecha_nacimiento: '1990-01-01'
    };
    setUsuario(datosGuardados);
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imagen_perfil' && files.length > 0) {
      setUsuario({ ...usuario, [name]: URL.createObjectURL(files[0]) });
    } else {
      setUsuario({ ...usuario, [name]: value });
    }
  };

  const handleGuardar = () => {
    // Simulación de guardar los datos
    localStorage.setItem('usuario', JSON.stringify(usuario));
    alert('Datos guardados (simulación)');
  };

  return (
    <div className="perfil-container">
      <h2>Perfil de Usuario</h2>

      {usuario.imagen_perfil && (
        <img src={usuario.imagen_perfil} alt="Perfil" className="imagen-perfil" />
      )}
      <input type="file" name="imagen_perfil" onChange={handleChange} />

      <input
        type="text"
        name="nombre"
        value={usuario.nombre}
        placeholder="Nombre"
        onChange={handleChange}
      />

      <input
        type="email"
        name="correo"
        value={usuario.correo}
        placeholder="Correo"
        onChange={handleChange}
      />

      <input
        type="password"
        name="contrasena"
        value={usuario.contrasena}
        placeholder="Contraseña"
        onChange={handleChange}
      />

      <input
        type="text"
        name="numero_telefono"
        value={usuario.numero_telefono}
        placeholder="Número de teléfono"
        onChange={handleChange}
      />

      <input
        type="date"
        name="fecha_nacimiento"
        value={usuario.fecha_nacimiento}
        onChange={handleChange}
      />

      <button onClick={handleGuardar}>Guardar cambios</button>
    </div>
  );
}

export default Perfil;
