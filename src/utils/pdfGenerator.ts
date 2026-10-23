import jsPDF from 'jspdf';
import { LESSONS } from '@/lessons';

const siteHost = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/^https?:\/\//, '');

/** jsPDF's built-in fonts only cover plain Latin text, so swap typographic characters for plain ones. */
const plain = (text: string) =>
  text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/↑/g, 'Up')
    .replace(/↓/g, 'Down');

/** Every command from the course on one or two pages, grouped by lesson. */
export const generateCommandCheatSheet = () => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 18;
  const commandWidth = 52;
  let y = 22;

  const ensureRoom = (needed: number) => {
    if (y + needed > pageHeight - 20) {
      pdf.addPage();
      y = 22;
    }
  };

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  pdf.text('Terminal Mastery: command cheat sheet', margin, y);
  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(90, 100, 115);
  pdf.text(`Every command from the ${LESSONS.length} lessons, in the order you learned them.`, margin, y);
  pdf.setTextColor(0, 0, 0);
  y += 10;

  for (const lesson of LESSONS) {
    ensureRoom(18);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(37, 99, 235);
    pdf.text(`${String(lesson.number).padStart(2, '0')}  ${plain(lesson.title)}`, margin, y);
    pdf.setTextColor(0, 0, 0);
    y += 6;

    for (const command of lesson.commands) {
      const description = pdf.splitTextToSize(plain(command.does), pageWidth - margin * 2 - commandWidth);
      ensureRoom(description.length * 4.6 + 2);
      pdf.setFont('courier', 'bold');
      pdf.setFontSize(9.5);
      pdf.text(plain(command.name), margin + 2, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.text(description, margin + commandWidth, y);
      y += description.length * 4.6 + 1.6;
    }
    y += 4;
  }

  pdf.setFontSize(8);
  pdf.setTextColor(120, 130, 145);
  pdf.text(`Terminal Mastery - ${siteHost()}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

  return pdf;
};

export const generateCertificate = (userName: string) => {
  const pdf = new jsPDF('landscape');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Dark background
  pdf.setFillColor(15, 23, 42); // slate-900 equivalent
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Main border with accent color
  pdf.setDrawColor(59, 130, 246); // blue-500
  pdf.setLineWidth(4);
  pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

  // Inner border
  pdf.setDrawColor(100, 116, 139); // slate-500
  pdf.setLineWidth(1);
  pdf.rect(25, 25, pageWidth - 50, pageHeight - 50);

  // Terminal icon/decoration at top
  pdf.setTextColor(34, 197, 94); // green-500
  pdf.setFontSize(24);
  pdf.text('$', pageWidth / 2 - 10, 45, { align: 'center' });
  pdf.text('>', pageWidth / 2 + 10, 45, { align: 'center' });

  // Title
  pdf.setTextColor(248, 250, 252); // slate-50
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Certificate of Completion', pageWidth / 2, 65, { align: 'center' });

  // Subtitle with accent
  pdf.setTextColor(59, 130, 246); // blue-500
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Terminal Mastery Course', pageWidth / 2, 80, { align: 'center' });

  // Divider line
  pdf.setDrawColor(100, 116, 139); // slate-500
  pdf.setLineWidth(1);
  pdf.line(pageWidth / 2 - 50, 90, pageWidth / 2 + 50, 90);

  // "This certifies that"
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.setFontSize(12);
  pdf.text('This certifies that', pageWidth / 2, 110, { align: 'center' });

  // User name with highlight
  pdf.setTextColor(248, 250, 252); // slate-50
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text(userName, pageWidth / 2, 130, { align: 'center' });

  // Achievement text
  pdf.setTextColor(203, 213, 225); // slate-300
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`has completed all ${LESSONS.length} lessons of Terminal Mastery, typing every`, pageWidth / 2, 150, { align: 'center' });
  pdf.text('command in a practice terminal that checked the work.', pageWidth / 2, 165, { align: 'center' });

  // Date
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.setTextColor(148, 163, 184); // slate-400
  pdf.setFontSize(10);
  pdf.text(`Completed on ${today}`, pageWidth / 2, 200, { align: 'center' });

  // Footer
  pdf.setTextColor(100, 116, 139); // slate-500
  pdf.setFontSize(9);
  pdf.text(`Terminal Mastery - ${siteHost()}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

  return pdf;
};