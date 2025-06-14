import React, { useState,useEffect } from 'react';
import usePostApi from '../hooks/usePostApi';
import './Proyectos.css';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';

function Proyectos() {
  const [form, setForm] = useState({
    nombre_proyecto: '',
    descripcion: '',
    fecha_fin: ''
  });

  const token = localStorage.getItem('authToken');
  const { data, loading, error, postData } = usePostApi('/projects', token);
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
      ...form,
      descripcion: `${form.descripcion}`
    };

  
    await postData(sanitizedForm);
    setForm({
      nombre_proyecto: '',
      descripcion: '',
      fecha_fin: ''
    });

    if (!error && data) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/proyectos');
      }, 2000);
    }
  };

  useEffect(() => {
    if (data) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/');
      }, 2000);
    }
  }, [data, navigate]);

  return (
    <div className="proyectos-container">
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>¡Proyecto creado correctamente!</h3>
            <p>Serás redirigido en unos segundos...</p>
          </div>
        </div>
      )}
      <div className="proyectos-cards">
        <div className="proyecto-cardis">
          <form className="form-crear-proyecto styled-form custom-crearProyecto" onSubmit={handleSubmit}>
            <h2 className="form-title">Crear Proyecto</h2>
            <div className="form-group">
              <label htmlFor="nombre_proyecto" className="form-label">Nombre del proyecto</label>
              <input
                type="text"
                id="nombre_proyecto"
                name="nombre_proyecto"
                className="form-input"
                placeholder="Nombre del proyecto"
                value={form.nombre_proyecto}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descripcion" className="form-label">Descripción</label>
              <CKEditor
                editor={ClassicEditor}
                data={form.descripcion || ''} // Ensure data is not null or undefined
                onChange={handleEditorChange}
                onReady={handleEditorReady}
                config={{
                  licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDk4NTkxOTksImp0aSI6IjhmYTMyOTNiLThkZjQtNGEzNS1hYTA0LTE0ZDRkOTM2YTk3MyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImE4YTY1YjQ1In0.SmfmK72afO2bE04NzkU2i2XltlHwJ1v6UcAz65Ezom4Tn4Xm_gV7-QsBoA6pcVQhd7gqRjxon5Y_57S4kq_mkQ',
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
              <label htmlFor="fecha_fin" className="form-label">Fecha de finalización</label>
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
            <button className="btn blue form-btn" type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
            {error && <p className="error">Error al crear el proyecto</p>}
            {data && <p className="success">Proyecto creado correctamente</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Proyectos;