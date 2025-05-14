import React, { useState, useEffect } from 'react';
import usePostApi from '../hooks/usePostApi';
import './Tareas.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';

function Tareas() {
  const [form, setForm] = useState({
    nombre_tarea: '',
    descripcion: '',
    fecha_limite: '',
    estado: 'por_hacer'
  });

  const token = localStorage.getItem('authToken');
  const { projectId, tareaId } = useParams();
  const { data, loading, error, postData } = usePostApi(`/tasks/project/${projectId}/tareas`, token);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

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
    
    const sanitizedForm = {
      nombre_tarea: form.nombre_tarea,
      descripcion: form.descripcion,
      fecha_limite: form.fecha_limite,
      estado_id: form.estado === 'por_hacer' ? 1 : form.estado === 'en_progreso' ? 2 : 3
    };

    await postData(sanitizedForm);
    setForm({
      nombre_tarea: '',
      descripcion: '',
      fecha_limite: '',
      estado: 'por_hacer'
    });
  
    if (!error && data) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(`/proyectos/${projectId}`);
      }, 2000);
    }
  };

  useEffect(() => {
    if (data) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate(`/proyectos/${projectId}`);
      }, 2000);
    }
  }, [data, navigate, loading]);

  return (
    <div className="container mt-5">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>¡Tarea creada correctamente!</h3>
            <p>Serás redirigido en unos segundos...</p>
          </div>
        </div>
      )}
      <div className="row justify-content-center">
        <div className="col-md-8 card card-crear-tareas">
          <form className="form-crear-tarea" onSubmit={handleSubmit}>
            <h2 className="mb-4 custom-crear-tarea">Crear Tarea</h2>
            <div className="mb-3">
              <label htmlFor="nombre_tarea " className="custom-crear-tarea form-label ">Nombre de la tarea</label>
              <input
                type="text"
                id="nombre_tarea"
                name="nombre_tarea"
                className="form-control"
                placeholder="Nombre de la tarea"
                value={form.nombre_tarea}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <CKEditor
                editor={ClassicEditor}
                data={form.descripcion || ''}
                onChange={handleEditorChange}
                onReady={handleEditorReady}
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
                    toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                    styles: ['full', 'alignLeft', 'alignRight'],
                  },
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="fecha_limite" className="form-label">Fecha límite</label>
              <input
                type="date"
                id="fecha_limite"
                name="fecha_limite"
                className="form-control"
                value={form.fecha_limite}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select
                id="estado"
                name="estado"
                className="form-select"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="por_hacer">Por hacer</option>
                <option value="en_progreso">En progreso</option>
                <option value="listo">Completada</option>
              </select>
            </div>
            <button className="btn btn-crear-tarea btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
            {error && <p className="text-danger mt-3">Error al crear la tarea</p>}
            {data && <p className="text-success mt-3">Tarea creada correctamente</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Tareas;