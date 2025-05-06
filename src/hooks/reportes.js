import axios from 'axios';


export async function obtenerReporteDelProyecto(authData, projectId) {
    const { token, organizacion_id } = authData;

    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports/projects/${projectId}/progress/${organizacion_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            params: {
                organizationId: organizacion_id
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener el reporte de progreso:', error.message);
    }
}
