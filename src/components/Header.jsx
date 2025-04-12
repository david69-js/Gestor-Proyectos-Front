import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Gestor de Proyectos</h1>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/tareas">Tareas</Link>
          </li>
          <li>
            <Link to="/proyectos">Proyectos</Link>
          </li>
          {/* Puedes agregar más enlaces según lo necesites */}
          <li>
            <Link to="/" onClick={() => localStorage.removeItem('isAuthenticated')}>Cerrar sesión</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
