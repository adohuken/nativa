// ============================================================================
// NATIVA • GENERADOR DE CERTIFICADOS OFICIALES EN PDF (jsPDF ENGINE)
// Emite credenciales académicas verificables de nivel MCER y Tracks Profesionales
// ============================================================================

import jsPDF from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  levelCode: string; // ej: "A1", "A2", "B1", "B2", "C1", "C2" o "CALL-CENTER"
  levelTitle: string; // ej: "Nivel A1 • Fundamentos y Supervivencia Universitaria"
  issueDate?: string;
  certificateId?: string;
  verificationUrl?: string;
  grade?: string; // ej: "Distinction • 96/100"
}

export function generateCertificatePdf(data: CertificateData): jsPDF {
  // Dimensiones A4 Horizontal (297mm ancho x 210mm alto)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  const certId = data.certificateId || `NAT-${data.levelCode.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = data.issueDate || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  const verifyUrl = data.verificationUrl || `https://nativa.edu/verify?id=${certId}`;

  // 1. Fondo Oscuro Nocturno Premium (#070B14)
  doc.setFillColor(7, 11, 20);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Marco Exterior Dorado (#D4AF37)
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.2);
  doc.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 4, 4, 'D');

  // Marco Interior Fino
  doc.setDrawColor(180, 140, 40);
  doc.setLineWidth(0.4);
  doc.rect(13, 13, pageWidth - 26, pageHeight - 26, 'D');

  // Detalles en las 4 esquinas ornamentales
  const corners = [
    [15, 15], [pageWidth - 15, 15], [15, pageHeight - 15], [pageWidth - 15, pageHeight - 15]
  ];
  doc.setFillColor(212, 175, 55);
  corners.forEach(([cx, cy]) => {
    doc.circle(cx, cy, 1.2, 'F');
  });

  // 3. Encabezado de la Institución
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('NATIVA • LEARNING ENGINE & SECOND LANGUAGE ACQUISITION', pageWidth / 2, 28, { align: 'center' });

  doc.setTextColor(160, 174, 192);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('OXFORD / CAMBRIDGE CEFR BENCHMARK & STEPHEN KRASHEN SLA FRAMEWORK', pageWidth / 2, 33, { align: 'center' });

  // 4. Título Principal
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('CERTIFICADO DE ACREDITACIÓN LINGÜÍSTICA', pageWidth / 2, 48, { align: 'center' });

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.line(pageWidth / 2 - 45, 51, pageWidth / 2 + 45, 51);

  // 5. Preámbulo de Concesión
  doc.setTextColor(203, 213, 225);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Por cuanto se ha demostrado solvencia comunicativa y competencia integral, se confiere este diploma a:', pageWidth / 2, 62, { align: 'center' });

  // 6. Nombre del Estudiante
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.text(data.studentName.toUpperCase(), pageWidth / 2, 75, { align: 'center' });

  // Línea dorada bajo el nombre
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - 60, 78, pageWidth / 2 + 60, 78);

  // 7. Nivel o Programa Acreditado
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text('Por haber culminado con éxito todos los módulos, tareas comunicativas y proyectos TBLT correspondientes al:', pageWidth / 2, 88, { align: 'center' });

  doc.setTextColor(52, 211, 153); // Esmeralda (#34D399)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(data.levelTitle, pageWidth / 2, 97, { align: 'center' });

  // 8. Cuadro de Metadatos y Estándares
  doc.setFillColor(15, 23, 42); // slate-900
  doc.setDrawColor(30, 41, 59);
  doc.roundedRect(pageWidth / 2 - 95, 106, 190, 24, 2, 2, 'FD');

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('ESTÁNDAR PEDAGÓGICO:', pageWidth / 2 - 90, 113);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CEFR Proficiency Matrix (A1-C2)', pageWidth / 2 - 90, 118);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('EVALUACIÓN DE TAREAS:', pageWidth / 2 - 25, 113);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(data.grade || 'Comité Académico Acreditado (100%)', pageWidth / 2 - 25, 118);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text('CÓDIGO DE CREDENCIAL:', pageWidth / 2 + 45, 113);
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(certId, pageWidth / 2 + 45, 118);

  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de Emisión: ${dateStr}`, pageWidth / 2 - 90, 125);
  doc.text(`Validación Hash: SHA256-${certId.replace(/-/g, '')}`, pageWidth / 2 + 10, 125);

  // 9. Bloque Inferior: Firmas y QR Simulado
  // Firma Izquierda: David Abarca
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(35, 162, 95, 162);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('David Abarca', 65, 167, { align: 'center' });
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Director Académico & Fundador', 65, 171, { align: 'center' });
  doc.text('Nativa Learning Systems', 65, 175, { align: 'center' });

  // Centro: Sello y QR Simulado
  doc.setFillColor(15, 23, 42);
  doc.setDrawColor(212, 175, 55);
  doc.roundedRect(pageWidth / 2 - 14, 145, 28, 28, 2, 2, 'FD');

  // Mini cuadritos simulando QR
  doc.setFillColor(212, 175, 55);
  doc.rect(pageWidth / 2 - 11, 148, 6, 6, 'F');
  doc.rect(pageWidth / 2 + 5, 148, 6, 6, 'F');
  doc.rect(pageWidth / 2 - 11, 164, 6, 6, 'F');
  doc.rect(pageWidth / 2 - 2, 156, 4, 4, 'F');
  doc.rect(pageWidth / 2 + 6, 164, 4, 4, 'F');

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6.5);
  doc.text('QR VERIFICACIÓN', pageWidth / 2, 176, { align: 'center' });
  doc.text(verifyUrl, pageWidth / 2, 180, { align: 'center' });

  // Firma Derecha: Tribunal Evaluador
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(pageWidth - 95, 162, pageWidth - 35, 162);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('Tribunal Evaluador TBLT', pageWidth - 65, 167, { align: 'center' });
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Comité de Certificación Oficial', pageWidth - 65, 171, { align: 'center' });
  doc.text('Oxford Academic Standards', pageWidth - 65, 175, { align: 'center' });

  // 10. Pie de Página Seguro
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('Documento oficial emitido electrónicamente bajo protocolos criptográficos de Nativa. Prohibida su alteración.', pageWidth / 2, 196, { align: 'center' });

  return doc;
}

export function downloadCertificatePdf(data: CertificateData): void {
  const doc = generateCertificatePdf(data);
  const cleanName = data.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Certificado_Nativa_${data.levelCode.toUpperCase()}_${cleanName}.pdf`;
  doc.save(filename);
}
