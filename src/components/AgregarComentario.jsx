import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import usePostApi from '../hooks/usePostApi';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';


function AgregarComentario({ projectId, tareaId, onComentarioAgregado, token }) {
  
  const [comentario, setComentario] = useState('');
  const { postData } = usePostApi(`/tasks/project/${projectId}/tareas/${tareaId}/comentarios`, token );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoComentario = { comentario };
    const result = await postData(nuevoComentario);
     if (result) {
       onComentarioAgregado(result.data);
       setComentario('');
     }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <CKEditor
        editor={ClassicEditor}
        data={comentario}
        onChange={(event, editor) => setComentario(editor.getData())}
        onReady={(editor) => {
          editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
            return new CustomUploadAdapter(loader);
          };
        }}
        config={{
          licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDg0NzY3OTksImp0aSI6Ijc0YzJhYmVkLTRkNTMtNDZjMy04YzU1LTNjYmRiYmVlNzNkOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjAzYTY0NzdkIn0.JCJlAtYQ2wSKD9O0et-aM2reZNWD7INP41cN1mzNlRDmIOsFu62-uv5ZT-F0pV3I_6RKmjWlwQuzGu3jYSNvWg',
          toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
            'imageUpload',
          ],
          image: {
            toolbar: [
              'imageTextAlternative',
              '|',
              'imageStyle:alignLeft',
              'imageStyle:full',
              'imageStyle:alignRight',
            ],
            styles: ['full', 'alignLeft', 'alignRight'],
          },
        }}
      />
      <button type="submit" className="btn btn-primary mt-2 custome-botones">Agregar Comentario</button>
    </form>
  );
}

export default AgregarComentario;