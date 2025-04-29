/* eslint-env node */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import necessary function for __dirname equivalent

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001; // Puedes usar el puerto que prefieras

// Sirve los archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Esta ruta catch-all usa una expresión regular para asegurar que las rutas de React Router funcionen
// Envía 'index.html' para cualquier petición GET que no sea un archivo estático
// (Se asume que no tienes rutas de API que empiecen con /api, si las tienes, ajusta la regex)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});