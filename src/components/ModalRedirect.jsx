import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ModalRedirect({ mensaje, redireccion, textoBoton = "Aceptar", segundos = 0 }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (segundos > 0) {
      const timer = setTimeout(() => {
        handleRedirect();
      }, segundos * 1000);
      return () => clearTimeout(timer);
    }
  }, [segundos]);

  const handleRedirect = () => {
    if (redireccion) {
      navigate(redireccion);
    } else {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <h3>{mensaje}</h3>
        <button
          onClick={handleRedirect}
          style={{
            marginTop: '1.5rem',
            background: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
}

export default ModalRedirect;
