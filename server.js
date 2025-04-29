/* eslint-env node */
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression'; // Importar compression

// Replicate __dirname functionality in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3001;

app.use(compression()); // Usar compression ANTES de express.static

// Sirve los archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta catch-all para React Router (simplificada)
// Envía 'index.html' para cualquier petición que no sea un archivo estático
app.get('*', (req, res) => { // Volvemos a '*' por simplicidad, puede funcionar mejor en producción
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});