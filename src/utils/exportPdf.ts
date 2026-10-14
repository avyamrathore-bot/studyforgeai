import jsPDF from 'jspdf';
import { StudyDocument } from '../types/study';

export function exportStudyGuideToPdf(doc: StudyDocument): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      pdf.addPage();
      y = margin;
      drawPageHeader();
    }
  };

  const drawPageHeader = () => {
    pdf.setFillColor(99, 102, 241); // Indigo
    pdf.rect(margin, y, contentWidth, 1.5, 'F');
    y += 5;
  };

  // 1. Cover / Top Header
  pdf.setFillColor(79, 70, 229); // #4f46e5 Indigo-600
  pdf.roundedRect(margin, y, contentWidth, 24, 3, 3, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('StudyForge AI | Smart Revision Guide', margin + 6, y + 9);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const boardLabel = doc.board.toUpperCase() + ' Mode';
  pdf.text(`${boardLabel} • ${doc.grade} • Generated: ${new Date().toLocaleDateString()}`, margin + 6, y + 17);

  y += 30;

  // Title
  pdf.setTextColor(30, 41, 59);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(18);
  const titleLines = pdf.splitTextToSize(doc.title, contentWidth);
  pdf.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Overview box
  if (doc.overview) {
    checkPageBreak(25);
    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
    pdf.setTextColor(71, 85, 105);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9.5);
    const overviewLines = pdf.splitTextToSize(doc.overview, contentWidth - 8);
    pdf.text(overviewLines, margin + 4, y + 6);
    y += 24;
  }

  // Mnemonic box if present
  if (doc.quickRevisionMnemonic) {
    checkPageBreak(18);
    pdf.setFillColor(254, 243, 199); // amber-100
    pdf.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
    pdf.setTextColor(180, 83, 9); // amber-700
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('MEMORIZATION HACK / MNEMONIC:', margin + 4, y + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(146, 64, 14);
    const mLines = pdf.splitTextToSize(doc.quickRevisionMnemonic, contentWidth - 8);
    pdf.text(mLines, margin + 4, y + 10);
    y += 18;
  }

  // 2. Smart Notes Section
  checkPageBreak(20);
  pdf.setTextColor(79, 70, 229);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.text('1. Key Concepts & High-Yield Summary', margin, y);
  y += 7;

  doc.smartNotes.forEach((section, index) => {
    checkPageBreak(25);

    // Section title
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`${index + 1}. ${section.sectionTitle}`, margin, y);
    y += 5;

    // Summary
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(51, 65, 85);
    const sLines = pdf.splitTextToSize(section.summary, contentWidth);
    pdf.text(sLines, margin, y);
    y += sLines.length * 4.5 + 2;

    // Key points
    if (section.keyPoints && section.keyPoints.length > 0) {
      section.keyPoints.forEach((point) => {
        checkPageBreak(8);
        pdf.setTextColor(99, 102, 241);
        pdf.text('•', margin + 2, y);
        pdf.setTextColor(51, 65, 85);
        const pLines = pdf.splitTextToSize(point, contentWidth - 8);
        pdf.text(pLines, margin + 6, y);
        y += pLines.length * 4.5 + 1;
      });
    }

    // Formulas or Definitions
    if (section.formulasOrDefinitions && section.formulasOrDefinitions.length > 0) {
      checkPageBreak(12);
      pdf.setFillColor(243, 232, 255); // purple-100
      pdf.rect(margin, y, contentWidth, 7, 'F');
      pdf.setTextColor(126, 34, 206);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      pdf.text(`Key Formula / Rule: ${section.formulasOrDefinitions.join(' | ')}`, margin + 3, y + 5);
      y += 10;
    }

    // Exam tip
    if (section.examTip) {
      checkPageBreak(12);
      pdf.setTextColor(217, 119, 6);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8.5);
      const tipLines = pdf.splitTextToSize(`Board Exam Tip: ${section.examTip}`, contentWidth - 4);
      pdf.text(tipLines, margin + 2, y);
      y += tipLines.length * 4 + 3;
    }

    y += 4;
  });

  // 3. MCQs Section
  if (doc.mcqs && doc.mcqs.length > 0) {
    checkPageBreak(25);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('2. Practice MCQs & Question Bank', margin, y);
    y += 8;

    doc.mcqs.forEach((mcq, idx) => {
      checkPageBreak(30);

      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      const qLines = pdf.splitTextToSize(`Q${idx + 1}. ${mcq.question} ${mcq.tag ? `[${mcq.tag}]` : ''}`, contentWidth);
      pdf.text(qLines, margin, y);
      y += qLines.length * 4.5 + 2;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      mcq.options.forEach((opt, oIdx) => {
        checkPageBreak(6);
        const isCorrect = oIdx === mcq.correctIndex;
        if (isCorrect) {
          pdf.setTextColor(22, 101, 52); // green-800
          pdf.setFont('helvetica', 'bold');
        } else {
          pdf.setTextColor(71, 85, 105);
          pdf.setFont('helvetica', 'normal');
        }
        const optLetter = String.fromCharCode(65 + oIdx);
        const optLine = pdf.splitTextToSize(`(${optLetter}) ${opt} ${isCorrect ? '✓ [Correct Answer]' : ''}`, contentWidth - 6);
        pdf.text(optLine, margin + 4, y);
        y += optLine.length * 4.2;
      });

      // Explanation
      if (mcq.explanation) {
        checkPageBreak(10);
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'italic');
        pdf.setFontSize(8);
        const expLines = pdf.splitTextToSize(`Explanation: ${mcq.explanation}`, contentWidth - 6);
        pdf.text(expLines, margin + 4, y + 1);
        y += expLines.length * 3.5 + 4;
      }
      y += 2;
    });
  }

  // 4. Board Expected Questions & Marking Scheme
  if (doc.boardQuestions && doc.boardQuestions.length > 0) {
    checkPageBreak(25);
    pdf.setTextColor(79, 70, 229);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('3. Expected Board Exam Questions & Model Answers', margin, y);
    y += 8;

    doc.boardQuestions.forEach((bq, idx) => {
      checkPageBreak(35);
      pdf.setTextColor(30, 58, 138); // blue-900
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      const bqTitle = `Q${idx + 1} (${bq.type}): ${bq.question}`;
      const bqLines = pdf.splitTextToSize(bqTitle, contentWidth);
      pdf.text(bqLines, margin, y);
      y += bqLines.length * 4.5 + 2;

      // Model answer
      pdf.setTextColor(51, 65, 85);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const maLines = pdf.splitTextToSize(`Model Answer: ${bq.modelAnswer}`, contentWidth - 4);
      pdf.text(maLines, margin + 2, y);
      y += maLines.length * 4.2 + 2;

      if (bq.markingSchemeTips) {
        checkPageBreak(8);
        pdf.setTextColor(180, 83, 9);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        const msLines = pdf.splitTextToSize(`Marking Scheme Breakdown: ${bq.markingSchemeTips}`, contentWidth - 4);
        pdf.text(msLines, margin + 2, y);
        y += msLines.length * 4 + 4;
      }
    });
  }

  // Footer for all pages
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `StudyForge AI • ${doc.title} • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const safeFileName = doc.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  pdf.save(`StudyForge_${safeFileName}_${doc.board}.pdf`);
}
