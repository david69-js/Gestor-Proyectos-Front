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
    estado: ''
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
      estado_id: 'por_hacer'
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
  }, [data, navigate]);

  return (
    <div className="tareas-container">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>¡Tarea creada correctamente!</h3>
            <p>Serás redirigido en unos segundos...</p>
          </div>
        </div>
      )}
      <div className="tareas-cards">
        <div className="tarea-card">
          <form className="form-crear-tarea styled-form" onSubmit={handleSubmit}>
            <h2 className="form-title">Crear Tarea</h2>
            <div className="form-group">
              <label htmlFor="nombre_tarea" className="form-label">Nombre de la tarea</label>
              <input
                type="text"
                id="nombre_tarea"
                name="nombre_tarea"
                className="form-input"
                placeholder="Nombre de la tarea"
                value={form.nombre_tarea}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <CKEditor
                editor={ClassicEditor}
                data={form.descripcion || ''}
                onChange={handleEditorChange}
                onReady={handleEditorReady}
                config={{
                  licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDcxODA3OTksImp0aSI6ImE1ODdmYWQ0LTgxODgtNDI4NS04MDEyLTEyODM5MDlkZGI4YiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjI0NzQ1ZmU4In0.i2TduVJSKMKXiiEeFC7tGOrBfBISmL1K5ipo5nvC_E3zE-qAoDMFqlMo1V8L3i71jGM5AOMcSsSd5BFotzleqw',
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
            <div className="form-group">
              <label htmlFor="fecha_limite" className="form-label">Fecha límite</label>
              <input
                type="date"
                id="fecha_limite"
                name="fecha_limite"
                className="form-input"
                value={form.fecha_limite}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select
                id="estado"
                name="estado"
                className="form-input"
                value={form.estado}
                onChange={handleChange}
                required
              >
                <option value="por_hacer">Por hacer</option>
                <option value="en_progreso">En progreso</option>
                <option value="Listo">Completada</option>
              </select>
            </div>
            <button className="btn blue form-btn" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Tarea'}
            </button>
            {error && <p className="error">Error al crear la tarea</p>}
            {data && <p className="success">Tarea creada correctamente</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Tareas;