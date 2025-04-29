import React, { useState } from 'react';
import usePostApi from '../hooks/usePostApi';
import './Proyectos.css';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function Proyectos() {

  // Estado para el formulario
  const [form, setForm] = useState({
    nombre_proyecto: '',
    descripcion: '',
    fecha_fin: ''
  });

  // Obtener el token de autenticación (ajusta según tu lógica)
  const token = localStorage.getItem('authToken');

  // Hook personalizado para POST
  const { data, loading, error, postData } = usePostApi('/projects', token);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData(form);
    setForm({
      nombre_proyecto: '',
      descripcion: '',
      fecha_fin: ''
    });
    // Solo mostrar el modal si la respuesta es positiva
    if (!error && data) {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/proyectos'); // Cambia la ruta si es necesario
      }, 2000);
    }
  };

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
        <div className="proyecto-card">
          <form className="form-crear-proyecto styled-form" onSubmit={handleSubmit}>
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
                data={form.descripcion}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setForm({ ...form, descripcion: data });
                }}
                config={{
                  placeholder: "Descripción detallada del proyecto"
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
