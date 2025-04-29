export default class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('upload', file); // Añade el archivo al FormData

          // Realiza la solicitud POST al servidor
          fetch(`${import.meta.env.VITE_API_URL}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Si necesitas token para la autenticación
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.url) {
                resolve({ default: data.url }); // Si la respuesta contiene la URL, la devuelve al editor
              } else {
                reject('No se obtuvo una URL válida del servidor.');
              }
            })
            .catch((error) => {
              // Captura cualquier error de la red o del servidor
              reject(`Error al subir el archivo: ${error.message || error}`);
            });
        })
    );
  }

  abort() {
    console.log('Subida del archivo abortada.');
  }
}
