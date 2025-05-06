import React from 'react';

function ReporteProyectos({ reporte, showModal, handleClose }) {
  // Agrupar tareas por estado
  const tareasAgrupadas = reporte.reduce((acc, tarea) => {
    if (!acc[tarea.estado_tarea]) {
      acc[tarea.estado_tarea] = [];
    }
    acc[tarea.estado_tarea].push(tarea);
    return acc;
  }, {});

  return (
    <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="reporteModalLabel" aria-hidden={!showModal}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="reporteModalLabel">Reporte de Proyectos</h5>
            <button type="button" className="btn-close" onClick={handleClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {Object.keys(tareasAgrupadas).map((estado, index) => (
              <div key={index} className="estado-tarea">
                <h3>Tareas {estado}</h3>
                <table className="table table-bordered" style={{ fontSize: '12px' }}>
                  <thead>
                    <tr>
                      <th className='fw-lighter fs-6'>Tarea</th>
                      <th className='fw-lighter fs-6'>Estado tarea</th>
                      <th className='fw-lighter fs-6'>Fecha Inicio</th>
                      <th className='fw-lighter fs-6'>Fecha Límite</th>
                      <th className='fw-lighter fs-6'>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareasAgrupadas[estado].map((tarea, idx) => {
                      const isOverdue = new Date(tarea.fecha_limite_tarea) < new Date() && tarea.estado_tarea !== 'Listo';
                      const rowClass = tarea.estado_tarea === 'Listo' ? 'table-success' : isOverdue ? 'table-danger' : 'table-warning';
                      return (
                        <React.Fragment key={idx}>
                          <tr className={rowClass}>
                            <td>{tarea.nombre_tarea}</td>
                            <td>{tarea.estado_tarea}</td>
                            <td>{new Date(tarea.fecha_creacion_tarea).toLocaleDateString()}</td>
                            <td>{new Date(tarea.fecha_limite_tarea).toLocaleDateString()}</td>
                            <td>{isOverdue ? 'La tarea aún no se completó' : tarea.estado_tarea}</td>
                          </tr>
                          <tr className={rowClass}>
                            <td colSpan="5"><strong>Asignados:</strong> {tarea.asignados ? tarea.asignados : 'No asignados'}</td>
                          </tr>
                          <tr><td colSpan="5" style={{ height: '10px' }}></td></tr> {/* Espacio en blanco */}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReporteProyectos;