import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          fetchUserData(decoded.id, token);
        } else {
          localStorage.removeItem('authToken');
          setAuthData(prev => ({...prev, isLoading: false}));
        }
      } catch (error) {
        console.error('Token inválido:', error);
        localStorage.removeItem('authToken');
        setAuthData(prev => ({...prev, isLoading: false}));
      }
    } else {
      setAuthData(prev => ({...prev, isLoading: false}));
    }
  }, [navigate]);

  const fetchUserData = async (userId, token) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        setAuthData({
          isAuthenticated: true,
          token,
          user: response.data,
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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { correo, contrasena },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('authToken', data.token);
        setAuthData({
          isAuthenticated: true,
          token: data.token,
          user: data.user,
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
