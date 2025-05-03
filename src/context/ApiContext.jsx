import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
const ApiContext = createContext();

// Configura el proveedor de contexto
const ApiProvider = ({ children }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Realiza la conexión a la API
        fetch('/api')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <ApiContext.Provider value={{ data }}>
            {children}
        </ApiContext.Provider>
    );
};

export { ApiContext, ApiProvider };
