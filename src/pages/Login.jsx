import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Registro from './Registro';
import './Login.css';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (usuario.trim() === '' || contrasena.trim() === '') {
      setError('Por favor, completa ambos campos.');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    navigate('/dashboard');
  };

  if (mostrarRegistro) {
    return <Registro volver={() => setMostrarRegistro(false)} />;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Entrar</button>

        <p style={{ marginTop: '1rem', color: '#f1f5f9', textAlign: 'center' }}>
          ¿No tienes cuenta?{' '}
          <button
            type="button"
            onClick={() => setMostrarRegistro(true)}
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
