import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registro.css'; // Importamos el archivo de estilos específico para el registro

function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    imagen_perfil: null,
    fecha_nacimiento: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegistro = (e) => {
    e.preventDefault();

    if (
      form.nombre.trim() === '' ||
      form.correo.trim() === '' ||
      form.contrasena.trim() === ''
    ) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Aquí iría la lógica real de registro (API o inserción en la BD)

    console.log('Datos registrados:', form);
    navigate('/login');
  };

  return (
    <div className="registro-container">
      <form onSubmit={handleRegistro} className="registro-form">
        <h2>Registro</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.contrasena}
          onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
        />

        <div className="form-group">
          <label htmlFor="imagen_perfil">Imagen de perfil</label>
          <input
            type="file"
            accept="image/*"
            id="imagen_perfil"
            onChange={(e) =>
              setForm({ ...form, imagen_perfil: e.target.files[0] })
            }
          />
          {form.imagen_perfil && (
            <img
              src={URL.createObjectURL(form.imagen_perfil)}
              alt="Vista previa"
              className="vista-previa"
            />
          )}
        </div>

        <div className="form-group">
          <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
          <input
            type="date"
            id="fecha_nacimiento"
            value={form.fecha_nacimiento}
            onChange={(e) =>
              setForm({ ...form, fecha_nacimiento: e.target.value })
            }
          />
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
