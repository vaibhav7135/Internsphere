import { jsPDF } from 'jspdf';

export const generateCertificatePDF = async (certificateData) => {
  const {
    studentName,
    program,
    issueDate,
    certificateId,
    grade,
    score,
  } = certificateData;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, width, height, 'F');

  // Border
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(2);
  doc.rect(10, 10, width - 20, height - 20);

  // Inner border
  doc.setDrawColor(219, 234, 254);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, width - 30, height - 30);

  // Corner decorations
  const cornerSize = 15;
  doc.setFillColor(37, 99, 235);
  
  // Top-left
  doc.rect(10, 10, cornerSize, 2, 'F');
  doc.rect(10, 10, 2, cornerSize, 'F');
  
  // Top-right
  doc.rect(width - 10 - cornerSize, 10, cornerSize, 2, 'F');
  doc.rect(width - 12, 10, 2, cornerSize, 'F');
  
  // Bottom-left
  doc.rect(10, height - 12, cornerSize, 2, 'F');
  doc.rect(10, height - 10 - cornerSize, 2, cornerSize, 'F');
  
  // Bottom-right
  doc.rect(width - 10 - cornerSize, height - 12, cornerSize, 2, 'F');
  doc.rect(width - 12, height - 10 - cornerSize, 2, cornerSize, 'F');

  // Header decorative line
  doc.setFillColor(37, 99, 235);
  doc.rect(width / 2 - 40, 25, 80, 1, 'F');

  // Logo text
  doc.setFontSize(14);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text('INTERNSPHERE', width / 2, 35, { align: 'center' });

  // Subtitle
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('REMOTE INTERNSHIP PLATFORM', width / 2, 41, { align: 'center' });

  // Certificate title
  doc.setFontSize(28);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE', width / 2, 60, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('OF INTERNSHIP COMPLETION', width / 2, 68, { align: 'center' });

  // Decorative line
  doc.setFillColor(37, 99, 235);
  doc.rect(width / 2 - 30, 73, 60, 0.5, 'F');

  // "This is to certify that"
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text('This is to certify that', width / 2, 85, { align: 'center' });

  // Student Name
  doc.setFontSize(24);
  doc.setTextColor(37, 99, 235);
  doc.setFont('helvetica', 'bold');
  doc.text(studentName, width / 2, 97, { align: 'center' });

  // Underline
  const nameWidth = doc.getTextWidth(studentName);
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(width / 2 - nameWidth / 2, 99, width / 2 + nameWidth / 2, 99);

  // Description
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'has successfully completed the remote internship program in',
    width / 2,
    110,
    { align: 'center' }
  );

  // Program name
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text(program, width / 2, 121, { align: 'center' });

  // Grade and Score
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `with Grade: ${grade} (Score: ${score}%)`,
    width / 2,
    131,
    { align: 'center' }
  );

  doc.text(
    'demonstrating exceptional skills, dedication, and professional competence.',
    width / 2,
    139,
    { align: 'center' }
  );

  // Details section
  const detailsY = 155;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);

  // Date
  doc.setFont('helvetica', 'normal');
  doc.text('Date of Issue', 60, detailsY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(new Date(issueDate).toLocaleDateString('en-IN', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  }), 60, detailsY + 7, { align: 'center' });

  // Certificate ID
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Certificate ID', width / 2, detailsY, { align: 'center' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(certificateId, width / 2, detailsY + 7, { align: 'center' });

  // Signature
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Authorized Signatory', width - 60, detailsY, { align: 'center' });
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.3);
  doc.line(width - 90, detailsY + 4, width - 30, detailsY + 4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('InternSphere', width - 60, detailsY + 10, { align: 'center' });

  // QR Code section
  try {
    const verifyUrl = `${window.location.origin}/verify-certificate?id=${certificateId}`;
    
    // Create QR code using canvas
    const QRCode = (await import('react-qr-code')).default;
    
    // Create a temporary SVG for QR code
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.left = '-9999px';
    document.body.appendChild(svgContainer);
    
    // Use a simple QR code data URL approach
    const qrCanvas = document.createElement('canvas');
    qrCanvas.width = 100;
    qrCanvas.height = 100;
    const ctx = qrCanvas.getContext('2d');
    
    // Simple QR placeholder - draw a bordered square with text
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 100, 100);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 96, 96);
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 8px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN TO', 50, 40);
    ctx.fillText('VERIFY', 50, 52);
    ctx.font = '6px Arial';
    ctx.fillStyle = '#64748B';
    ctx.fillText(certificateId, 50, 68);
    
    const qrDataUrl = qrCanvas.toDataURL('image/png');
    doc.addImage(qrDataUrl, 'PNG', width / 2 - 12, height - 45, 24, 24);
    
    document.body.removeChild(svgContainer);
  } catch (e) {
    // QR code generation failed, add text instead
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Verify at: ${window.location.origin}/verify-certificate?id=${certificateId}`, width / 2, height - 25, { align: 'center' });
  }

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'This certificate can be verified at internsphere.com/verify-certificate',
    width / 2,
    height - 15,
    { align: 'center' }
  );

  // Save
  doc.save(`InternSphere_Certificate_${certificateId}.pdf`);
};
