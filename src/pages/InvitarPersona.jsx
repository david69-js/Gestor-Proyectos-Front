import React, { useState } from 'react';
import './InvitarPersona.css'; 

function InvitarPersona() {
    const [correo, setCorreo] = useState('');
    const [tipoContribuyente, setTipoContribuyente] = useState('');

    const handleEnviar = (e) => {
        e.preventDefault();
        // Aquí conectas con tu backend para enviar la invitación
        console.log('Invitación enviada a:', correo);
        console.log('Tipo de contribuyente:', tipoContribuyente);
    };

    return (
        <div className="invitar-wrapper">
            <div className="invitar-container">
                <form className="invitar-form" onSubmit={handleEnviar}>
                    <h2>Invitar por Correo</h2>
                    <input
                        type="email"
                        placeholder="Correo del invitado"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <select
                        value={tipoContribuyente}
                        onChange={(e) => setTipoContribuyente(e.target.value)}
                        required
                    >
                        <option value="">Seleccione tipo de contribuyente</option>
                        <option value="Contribuyente_1">Contribuyente 1</option>
                        <option value="Contribuyente_2">Contribuyente 2</option>
                        <option value="Contribuyente_3">Contribuyente 3</option>
                    </select>
                    <button type="submit">Enviar Invitación</button>
                </form>
            </div>
        </div>
    );
}

export default InvitarPersona;
