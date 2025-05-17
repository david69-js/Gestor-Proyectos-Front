import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import usePostApi from '../hooks/usePostApi';
import { jwtDecode } from "jwt-decode";
import './Registro.css';

function Registro() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const invitacion = queryParams.get('invitacion');

  let decoded = null;
  let tokenValido = false;
  if (invitacion) {
    try {
      decoded = jwtDecode(invitacion);
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      if (decoded.exp && decoded.exp > currentTime) {
        tokenValido = true;
      } else {
        console.error('Token expirado');
      }
    } catch (error) {
      console.error('Error decoding invitacion:', error);
    }
  }

  const { id_organizacion, nombre_organizacion, email_invitado } = decoded || {};
  const [form, setForm] = useState({
    nombre: '',
    correo: email_invitado || '',
    contrasena: '',
    imagen_perfil: null,
    fecha_nacimiento: '',
    nombre_organizacion: nombre_organizacion || '',
    numero_telefono: '',
    token: invitacion || ''
  });

  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
      setPopupMessage('Por favor, completa todos los campos obligatorios.');
      setShowPopup(true);
      return;
    }

    if (tokenValido && form.correo !== email_invitado) {
      setPopupMessage('Este usuario no es el invitado.');
      setShowPopup(true);
      return;
    }

    setError('');
    
    const formData = new FormData();
    formData.append('nombre', form.nombre);
    formData.append('correo', form.correo);
    formData.append('contrasena', form.contrasena);
    formData.append('nombre_organizacion', form.nombre_organizacion);
    formData.append('numero_telefono', form.numero_telefono);
    formData.append('fecha_nacimiento', form.fecha_nacimiento);
    tokenValido ? formData.append('token', invitacion) : null;

    if (form.imagen_perfil) {
      formData.append('imagen_perfil', form.imagen_perfil);
    }

    const response = await postData(formData);
    if (response && response.status === 201) {
      setPopupMessage('Registro exitoso! Redirigiendo al login...');
      setShowPopup(true);
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setPopupMessage('El usuario ya existe.');
      setShowPopup(true);
    }
  };
  
  useEffect(() => {
    if (!tokenValido && invitacion) {
      setPopupMessage('El token no es válido o ha expirado. Redirigiendo al login...');
      setShowPopup(true);
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [tokenValido, invitacion, navigate]);

  const handleClosePopup = () => {
    setShowPopup(false);
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

        {tokenValido ? (
          <input
            type="text"
            placeholder="Nombre de la organización"
            value={form.nombre_organizacion}
            readOnly
            hidden
          />
        ) : (
          <input
            type="text"
            placeholder="Nombre de la organización"
            value={form.nombre_organizacion}
            onChange={(e) => setForm({ ...form, nombre_organizacion: e.target.value })}
          />
        )}

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
              <p>{popupMessage}</p>
              <button onClick={handleClosePopup}>Cerrar</button>
            </div>
          </>
        )}

        {apiError && <p className="error">Error: {apiError.message}</p>}
        {loading && <p>Cargando...</p>}

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
