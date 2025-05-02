import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi'; // Importa el hook useApiData
import useUpdateApi from '../hooks/useUpdateApi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';

function EditarTarea() {
  const { projectId, tareaId } = useParams();
  const navigate = useNavigate();
  const { data: tarea, loading: loadingTarea, error: errorTarea } = useApi(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    localStorage.getItem('authToken')
  );
  const { updateData, loading, error } = useUpdateApi(`/tasks/project/${projectId}/tareas/${tareaId}`, localStorage.getItem('authToken'));
  const [form, setForm] = useState({
    nombre_tarea: '',
    descripcion: '',
    fecha_limite: '',
    estado: 'por_hacer'
  });

  
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
      console.log(form);
    const updated = await updateData(form);
    if (updated) {
      navigate(`/proyectos/${projectId}/tareas/${tareaId}`)
    }
  };
  useEffect(() => {
    if (tarea) {
      setForm({
        nombre_tarea: tarea.nombre_tarea,
        descripcion: tarea.descripcion,
        fecha_limite: tarea.fecha_limite,
        estado: tarea.estado_tarea || 'por_hacer'
      });
    }
  }, [tarea]);

  return (
    <div className="proyectos-container">
      <h2 className="form-title">Editar Tarea</h2>
      <div className="bg-light pt-5 pb-5 row justify-content-center">
        <div className="col-md-8 card">
          <form className="form-crear-tarea" onSubmit={handleSubmit}>
            <h2 className="mb-4">Editar Tarea</h2>
            <div className="mb-3">
              <label htmlFor="nombre_tarea" className="form-label">Nombre de la tarea</label>
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
            <button className="btn btn-primary w-100" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            {error && <p className="text-danger mt-3">Error al guardar los cambios</p>}
            {errorTarea && <p className="text-danger mt-3">Error al cargar la tarea</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarTarea;