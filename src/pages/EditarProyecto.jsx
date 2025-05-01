import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApiData from '../hooks/useApiData';
import useUpdateApi from '../hooks/useUpdateApi'; // Importar el hook
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';

function EditarProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: proyecto, loading, error } = useApiData(`/projects/${id}`, localStorage.getItem('authToken'));
  const { updateData, loading: updating, error: updateError } = useUpdateApi(`/projects/${id}`, localStorage.getItem('authToken')); // Usar el hook
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
    const updated = await updateData(form); // Llamar a updateData
    if (updated) {
      navigate(`/proyectos/${id}`);
    }
  };

  return (
    <div className="container">
      <h2>Editar Proyecto</h2>
      {loading ? (
        <p>Cargando proyecto...</p>
      ) : error ? (
        <p>Error al cargar el proyecto</p>
      ) : (
        <form className="form-crear-proyecto styled-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre_proyecto" className="form-label">Nombre del proyecto</label>
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
            <label htmlFor="descripcion" className="form-label">Descripción</label>
            <CKEditor
              editor={ClassicEditor}
              data={form.descripcion || ''}
              onChange={handleEditorChange}
              onReady={handleEditorReady}
              config={{
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NDcxODA3OTksImp0aSI6ImE1ODdmYWQ0LTgxODgtNDI4NS04MDEyLTEyODM5MDlkZGI4YiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjI0NzQ1ZmU4In0.i2TduVJSKMKXiiEeFC7tGOrBfBISmL1K5ipo5nvC_E3zE-qAoDMFqlMo1V8L3i71jGM5AOMcSsSd5BFotzleqw',
                toolbar: [
                  'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'imageUpload'
                ],
                image: {
                  toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
                  styles: ['full', 'alignLeft', 'alignRight'],
                },
              }}
            />
          </div>
          <div className="form-group">
          <label className='form-label form-group-custom'>
            <label className='form-label form-group-custom'>Fecha de fin:</label>{" "}
            {proyecto.fecha_fin
              ? new Date(proyecto.fecha_fin).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : "No especificada"}
          </label>
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