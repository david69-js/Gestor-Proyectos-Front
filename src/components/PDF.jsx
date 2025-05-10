import React from 'react';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

function DescargarPDF({ reporte }) {
  const generarPDF = () => {
    const doc = new jsPDF();
    const tareasAgrupadas = reporte.reduce((acc, tarea) => {
      if (!acc[tarea.estado_tarea]) {
        acc[tarea.estado_tarea] = [];
      }
      acc[tarea.estado_tarea].push(tarea);
      return acc;
    }, {});

    let startY = 10;
    Object.keys(tareasAgrupadas).forEach((estado) => {
      doc.setFontSize(16);
      doc.text(`Tareas ${estado}`, 10, startY);
      autoTable(doc, {
        startY: startY + 10,
        head: [['Tarea', 'Estado tarea', 'Fecha Inicio', 'Fecha Límite', 'Estado']],
        body: tareasAgrupadas[estado].flatMap(tarea => {
          const isOverdue = new Date(tarea.fecha_limite_tarea) < new Date() && tarea.estado_tarea !== 'Listo';
          const estadoTexto = isOverdue ? 'La tarea aún no se completó' : tarea.estado_tarea;
          const asignados = tarea.asignados ? tarea.asignados : 'No asignados';
          const rowColor = tarea.estado_tarea === 'Listo' ? [204, 255, 204] : tarea.estado_tarea === 'En progreso' ? [255, 255, 204] : [255, 204, 204];
          return [
            [
              { content: tarea.nombre_tarea, styles: { fillColor: rowColor } },
              { content: tarea.estado_tarea, styles: { fillColor: rowColor } },
              { content: new Date(tarea.fecha_creacion_tarea).toLocaleDateString(), styles: { fillColor: rowColor } },
              { content: new Date(tarea.fecha_limite_tarea).toLocaleDateString(), styles: { fillColor: rowColor } },
              { content: estadoTexto, styles: { fillColor: rowColor } }
            ],
            [
              { content: `Asignados: ${asignados}`, colSpan: 5, styles: { halign: 'left', fillColor: rowColor } }
            ],
            [
              { content: '', colSpan: 5, styles: { fillColor: [255, 255, 255] } } // Fila en blanco
            ]
          ];
        }),
        styles: { fontSize: 12 },
        theme: 'grid'
      });
      startY = doc.lastAutoTable.finalY + 20; // Update startY for the next table
    });

    doc.save('Reporte-Proyecto.pdf');
  };

  return (
    <button onClick={generarPDF} className="btn btn-primary justify-content-center align-items-center">
      Descargar PDF
    </button>
  );
}

export default DescargarPDF;