import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (correo.trim() === '' || contrasena.trim() === '') {
      setError('Por favor, completa ambos campos.');
      return;
    }

    const result = await login(correo, contrasena);
    if (result) {
      console.log('Inicio de sesión exitoso');  // Agrega este cons
      navigate('/dashboard');  // o la ruta que corresponda
    } else {
      setError('Correo o contraseña incorrectos.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>

        <p style={{ marginTop: '1rem', color: '#f1f5f9', textAlign: 'center' }}>
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => navigate('/registro')}
            style={{
              background: 'none',
              border: 'none',
              color: '#60a5fa',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Regístrate
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
