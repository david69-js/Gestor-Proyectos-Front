import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usePostApi from '../hooks/usePostApi';
import './Registro.css';

function Registro() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    imagen_perfil: null,
    fecha_nacimiento: '',
    nombre_organizacion: '',
    numero_telefono: '',
  });

  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // Usar el custom hook para POST
  const { data, error: apiError, loading, postData } = usePostApi('/auth/register');

  const handleRegistro = async (e) => {
    e.preventDefault();

    if (
      form.nombre.trim() === '' ||
      form.correo.trim() === '' ||
      form.contrasena.trim() === '' ||
      form.nombre_organizacion.trim() === '' ||
      form.numero_telefono.trim() === ''
    ) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setError('');
    // Prepara el body para el registro
    const body = {
      ...form,
      fecha_nacimiento: form.fecha_nacimiento
        ? new Date(form.fecha_nacimiento).toISOString().split('T')[0]
        : ''
    };
    await postData(body);
  };

  useEffect(() => {
    if (data) {
      setShowPopup(true);
    }
  }, [data]);

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/login');
  };

  return (
    <div className="registro-container">
      <Link to="/login" className="back-button">
        &#x2190; Regresar al Login
      </Link>

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

        <input
          type="text"
          placeholder="Nombre de la organización"
          value={form.nombre_organizacion}
          onChange={(e) => setForm({ ...form, nombre_organizacion: e.target.value })}
        />

        <input
          type="text"
          placeholder="Número de teléfono"
          value={form.numero_telefono}
          onChange={(e) => setForm({ ...form, numero_telefono: e.target.value })}
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

        {showPopup && (
          <>
            <div className="overlay"></div>
            <div className="popup">
              <p>El usuario se registró correctamente.</p>
              <button onClick={handleClosePopup}>Aceptar</button>
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}
        {apiError && <p className="error">Error: {apiError.message}</p>}
        {loading && <p>Cargando...</p>}
        {data && <p>Registro exitoso!</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
