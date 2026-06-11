import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

export const generarPdfReporteMensual = (pagos, mes, anio) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
debugger;
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const nombreMes = meses[parseInt(mes) - 1] || 'Mes Indefinido';

  // --- PALETA DE COLORES (Nativos de jsPDF usan RGB) ---
  const PRIMARY_RGB  = [15, 23, 42];
  const ACCENT_RGB   = [59, 130, 246];

  // --- ENCABEZADO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(PRIMARY_RGB[0], PRIMARY_RGB[1], PRIMARY_RGB[2]);
  doc.text("REPORTE MENSUAL DE ASISTENCIA Y PAGOS", 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`Período: ${nombreMes} de ${anio}`, 14, 25);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 31);

  // --- LÍNEA DECORATIVA ---
  doc.setDrawColor(ACCENT_RGB[0], ACCENT_RGB[1], ACCENT_RGB[2]);
  doc.setLineWidth(0.5);
  doc.line(14, 35, 283, 35);

  // --- TOTAL GENERAL ---
  const granTotalMes = pagos.reduce((sum, p) => sum + Number(p.total || 0), 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(PRIMARY_RGB[0], PRIMARY_RGB[1], PRIMARY_RGB[2]);
  // 👇 Usamos CRC con un espacio
  doc.text(`Monto Total: CRC ${granTotalMes.toLocaleString('es-CR')}`, 200, 25);

  // --- FILAS ---
  const tableRows = pagos.map((p, index) => {
    const nombre = p.persona ? `${p.persona.nombre} ${p.persona.apellido}` : 'N/A';
    return [
      index + 1,
      nombre,
      `CRC ${Number(p.semana1 || 0).toLocaleString('es-CR')} ${p.semana1MetodoPago === 'SINPE' ? '(SINPE)' : '(Efectivo)'}`, // 👇 Añadido CRC
      `CRC ${Number(p.semana2 || 0).toLocaleString('es-CR')} ${p.semana2MetodoPago === 'SINPE' ? '(SINPE)' : '(Efectivo)'}`,
      `CRC ${Number(p.semana3 || 0).toLocaleString('es-CR')} ${p.semana3MetodoPago === 'SINPE' ? '(SINPE)' : '(Efectivo)'}`,
      `CRC ${Number(p.semana4 || 0).toLocaleString('es-CR')} ${p.semana4MetodoPago === 'SINPE' ? '(SINPE)' : '(Efectivo)'}`,
      `CRC ${Number(p.total   || 0).toLocaleString('es-CR')}`,
      p.recibo || 'Sin recibo',
      p.notas  || '-'
    ];
  });

  // --- TABLA ---
  autoTable(doc, { // 👈 Le pasas 'doc' como primer parámetro
    startY: 40,
    head: [['#', 'Persona', 'Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Total', 'N° Recibo', 'Notas']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: PRIMARY_RGB,
      textColor: '#ffffff',
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: '#334155'
    },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25, fontStyle: 'bold', textColor: '#3b82f6' }, 
      7: { cellWidth: 30 },
      8: { cellWidth: 55 }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 40, left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${doc.internal.getNumberOfPages()}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    }
  });

  doc.save(`Reporte_Pagos_${nombreMes}_${anio}.pdf`);
};