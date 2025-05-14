import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApiData from '../hooks/useApiData';
import useUpdateApi from '../hooks/useUpdateApi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';
import './EditarProyecto.css';
function EditarProyecto() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: proyecto, loading, error } = useApiData(
    `/projects/${projectId}`,
    localStorage.getItem('authToken')
  );
  const {
    updateData,
    loading: updating,
    error: updateError
  } = useUpdateApi(`/projects/${projectId}`, localStorage.getItem('authToken'));

  const [form, setForm] = useState({
    nombre_proyecto: '',
    descripcion: '',
    fecha_fin: ''
  });

  useEffect(() => {
    if (proyecto) {
      const fechaFin = proyecto.fecha_fin ? proyecto.fecha_fin.split('T')[0] : '';
      setForm({
        nombre_proyecto: proyecto.nombre_proyecto,
        descripcion: proyecto.descripcion,
        fecha_fin: fechaFin
      });
    }
  }, [proyecto]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setForm({ ...form, descripcion: data });
  };

  const handleEditorReady = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateData(form);
    if (updated) {
      navigate(`/proyectos/${projectId}`);
    }
  };

  return (
    <div className="container">
      <h2 id ='proyecto-title'>Editar Proyecto</h2>
      {loading ? (
        <p>Cargando proyecto...</p>
      ) : error ? (
        <p>Error al cargar el proyecto</p>
      ) : (
        <form className="form-crear-proyecto styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_proyecto" className="form-label">
              Nombre del proyecto
            </label>
            <input
              type="text"
              id="nombre_proyecto"
              name="nombre_proyecto"
              className="form-input"
              value={form.nombre_proyecto}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={form.descripcion || ''}
              onChange={handleEditorChange}
              onReady={handleEditorReady}
              config={{
                licenseKey:
                  'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDg0NzY3OTksImp0aSI6Ijc0YzJhYmVkLTRkNTMtNDZjMy04YzU1LTNjYmRiYmVlNzNkOCIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjAzYTY0NzdkIn0.JCJlAtYQ2wSKD9O0et-aM2reZNWD7INP41cN1mzNlRDmIOsFu62-uv5ZT-F0pV3I_6RKmjWlwQuzGu3jYSNvWg',
                toolbar: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'link',
                  'bulletedList',
                  'numberedList',
                  'blockQuote',
                  'imageUpload'
                ],
                image: {
                  toolbar: [
                    'imageTextAlternative',
                    '|',
                    'imageStyle:alignLeft',
                    'imageStyle:full',
                    'imageStyle:alignRight'
                  ],
                  styles: ['full', 'alignLeft', 'alignRight']
                }
              }}
            />
          </div>
          <div className="form-group">
            <label className="form-label form-group-custom">
              Fecha actual de fin:{' '}
              {proyecto.fecha_fin
                ? new Date(proyecto.fecha_fin).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'No especificada'}
            </label>
            <label htmlFor="fecha_fin" className="form-label">
              Nueva fecha de finalización
            </label>
            <input
              type="date"
              id="fecha_fin"
              name="fecha_fin"
              className="form-input"
              value={form.fecha_fin}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn blue form-btn" type="submit" disabled={updating}>
            {updating ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          {updateError && <p className="error">Error al actualizar el proyecto</p>}
        </form>
      )}
    </div>
  );
}

export default EditarProyecto;
