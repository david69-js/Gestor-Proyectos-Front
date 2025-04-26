const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Servir los archivos estáticos desde la carpeta 'build'
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todas las solicitudes a 'index.html' para manejar el enrutamiento de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});
