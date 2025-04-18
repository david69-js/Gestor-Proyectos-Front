import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
  });

  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          fetchUserData(decoded.id, token);
          console.log('Usuario autenticado:', decoded);
          
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('authToken');
      }
    }
  }, [navigate]); // Add navigate to the dependency array

  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const user = await response.json();
        setAuthData({
          isAuthenticated: true,
          token,
          user,
        });
      } else {
        console.error('Error al obtener los datos del usuario');
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      localStorage.removeItem('authToken');
    }
  };

  const login = async (correo, contrasena) => {
    if (!correo || !contrasena) {
      console.error('Correo y contraseña son requeridos');
      return null;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setAuthData({
          isAuthenticated: true,
          token: data.token,
          user: data.user, // Ensure user data is set correctly
        });
        return data;
      } else {
        console.error('Login fallido');
        return null;
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthData({
      isAuthenticated: false,
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
