export default class CustomUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();

          // Verificar si es un archivo múltiple
          if (Array.isArray(this.loader.file)) {
            this.loader.file.forEach((f) => formData.append('upload', f));
          } else {
            formData.append('upload', file);
          }

          fetch(`${import.meta.env.VITE_API_URL}/uploadfile`, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data && data.urls) {
                resolve({
                  default: data.urls, // Responde con un array de URLs
                });
              } else {
                reject('No se obtuvo una URL válida del servidor.');
              }
            })
            .catch((error) => {
              reject(`Error al subir los archivos: ${error.message || error}`);
            });
        })
    );
  }

  abort() {
    console.log('Subida de archivo abortada.');
  }
}
