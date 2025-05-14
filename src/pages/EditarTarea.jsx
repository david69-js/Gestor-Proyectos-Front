import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useApiData from '../hooks/useApiData';
import useUpdateApi from '../hooks/useUpdateApi';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CustomUploadAdapter from '../utils/CustomUploadAdapter';

function EditarTarea() {
  const { projectId, tareaId } = useParams();
  const navigate = useNavigate();
  const { data: tarea, loading, error } = useApiData(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    localStorage.getItem('authToken')
  );
  const { updateData, loading: updating, error: updateError } = useUpdateApi(
    `/tasks/project/${projectId}/tareas/${tareaId}`,
    localStorage.getItem('authToken')
  );
  const [form, setForm] = useState({
    nombre_tarea: '',
    descripcion: '',
    fecha_limite: '',
    estado_id: 1, // por defecto
  });

  useEffect(() => {
    if (tarea) {
      const fechaFin = tarea.fecha_limite ? tarea.fecha_limite.split('T')[0] : '';
      setForm({
        nombre_tarea: tarea.nombre_tarea || '',
        descripcion: tarea.descripcion || '',
        fecha_limite: fechaFin,
        estado_id: tarea.estado_id,
      });
    }
  }, [tarea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setForm((prevForm) => ({ ...prevForm, descripcion: data }));
  };

  const handleEditorReady = (editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      nombre_tarea: form.nombre_tarea,
      descripcion: form.descripcion,
      fecha_limite: form.fecha_limite,
      estado_id: parseInt(form.estado_id, 10),
    };
    const updated = await updateData(payload);
    if (updated) {
      navigate(`/proyectos/${projectId}/detalle-tarea/${tareaId}`);
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="proyectos-container">
      <div className="bg-light pt-5 pb-5 container justify-content-center row">
        <div className="col-md-8">
          <form className="form-crear-tarea" onSubmit={handleSubmit}>
            <h2 className="mb-4">Editar Tarea</h2>

            <div className="mb-3">
              <label htmlFor="nombre_tarea" className="form-label">
                Nombre de la tarea
              </label>
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
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={form.descripcion}
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
            </div>

            <div className="mb-3">
              <label htmlFor="fecha_limite" className="form-label">
                Fecha límite
              </label>
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
              <label htmlFor="estado_id" className="form-label">
                Estado
              </label>
              <select
                id="estado_id"
                name="estado_id"
                className="form-select"
                value={form.estado_id}
                onChange={handleChange}
                required
              >
                <option value={1}>Por hacer</option>
                <option value={2}>En progreso</option>
                <option value={3}>Completada</option>
              </select>
            </div>

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={updating || loading}
            >
              {updating ? 'Guardando...' : 'Guardar Cambios'}
            </button>

            {updateError && (
              <p className="text-danger mt-3">Error al guardar los cambios</p>
            )}
            {error && (
              <p className="text-danger mt-3">Error al cargar la tarea</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditarTarea;
