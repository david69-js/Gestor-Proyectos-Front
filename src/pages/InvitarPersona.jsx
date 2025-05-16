import React, { useContext, useState } from 'react';
import './InvitarPersona.css'; 
import usePostApi from '../hooks/usePostApi';
import useApiData from '../hooks/useApiData';
import { AuthContext } from '../context/AuthContext';

function InvitarPersona() {
    const { authData } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [showModalE, setShowModalE] = useState(false);
    const token = authData?.token;
    const { data: proyectos, loading: getLoading, error: geterror } = useApiData('/projects', token);
    const { data: postInvitacion, loading: postLoading, error: posterror, postData } = usePostApi(`/invitaciones/crear-invitacion`, token);
    
    const [form, setForm] = useState({
        email_destino: '',
        rol: 0,
        proyectoo: 0
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === 'rol' || name === 'proyectoo' ? Number(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sanitizedForm = {
            rol: form.rol,
            id_organizacion: authData?.organizacion_id,
            nombre_organizacion: authData?.organizacion,
            email_destino: form.email_destino,
            id_proyecto: form.proyectoo
        };

        console.log(sanitizedForm);
        const response = await postData(sanitizedForm);
        if (response && response.status === 201) { 
            setShowModal(true);
        } else {
            setShowModalE(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setShowModalE(false);
    };

    return (
        <div className="invitar-wrapper">
            {showModal && (
                <div className="modal fade show h-100 justify-content-center align-items-center" style={{ display: 'flex' }}>
                    <div className="modal-dialog mx-auto my-auto">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p>Invitación generada exitosamente</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModalE && (
                <div className="modal fade show h-100 justify-content-center align-items-center" style={{ display: 'flex' }}>
                    <div className="modal-dialog mx-auto my-auto">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p>Error {posterror ? posterror.message : ' desconocido'}</p>
                            </div>
                            <div className="modal-footer justify-content-center">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="invitar-container">
                <form className="invitar-form" onSubmit={handleSubmit}>
                    <h2 className='pb-1'>Invitar por Correo</h2>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <label htmlFor="correo">Correo del Invitado:</label>
                    <input
                        type="email"
                        name="email_destino"
                        placeholder="Correo del invitado"
                        value={form.email_destino}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="rol">Tipo de Contribuyente:</label>
                    <select
                        name="rol"
                        onChange={handleChange}
                        value={form.rol}
                        required
                    >
                        <option value=''>Selecciona un tipo de usuario</option>
                        <option value="2">Colaborador</option>
                        <option value="3">Cliente</option>
                    </select>

                    <label htmlFor="proyecto">Proyecto:</label>
                    <select
                        name="proyectoo"
                        onChange={handleChange}
                        value={form.proyectoo}
                    >
                        <option value=''>Selecciona un proyecto</option>
                        {proyectos && proyectos.map((proyecto) => (
                            <option key={proyecto.id} value={proyecto.id}>
                                {proyecto.nombre_proyecto}
                            </option>
                        ))}
                    </select>

                    <button type="submit" className="btn custom-btInvitar">Enviar Invitación</button>
                </form>
            </div>
        </div>
    );
}

export default InvitarPersona;
