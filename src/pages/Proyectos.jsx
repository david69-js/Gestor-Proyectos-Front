import React, { useState } from 'react';
import usePostApi from '../hooks/usePostApi';
import './Proyectos.css';
import { useNavigate } from 'react-router-dom';
// Importa el Editor de TinyMCE
import { Editor } from '@tinymce/tinymce-react';

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

  // Manejador específico para TinyMCE
  const handleEditorChange = (content, editor) => {
    setForm({ ...form, descripcion: content });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await postData(form);
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
              {/* Reemplaza CKEditor con el Editor de TinyMCE */}
              <Editor
                  apiKey='de53ebgsh1ixenaeaw6dztanyxx1zca9gbrrp3d59p4jba6d'
                  
                  onEditorChange={handleEditorChange} 
                  init={{
                    height: 400,
                    menubar: false,
                    paste_data_images: true,
                    plugins: [
                      // Core editing features
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until May 12, 2025:
                      'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
                    ],
                    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                      { value: 'First.Name', title: 'First Name' },
                      { value: 'Email', title: 'Email' },
                    ],
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                  }}
                  initialValue="Welcome to TinyMCE!"
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
