import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { renderToStaticMarkup } from 'react-dom/server';
import CV from '../components/CV';
import type { PortfolioData } from '../types/portfolio';

export async function generateNonATSPdf(data: PortfolioData) {
  const cvElement = document.createElement('div');
  cvElement.innerHTML = renderToStaticMarkup(React.createElement(CV, { data }));
  document.body.appendChild(cvElement);

  const canvas = await html2canvas(cvElement);
  document.body.removeChild(cvElement);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratio = canvasWidth / canvasHeight;
  const width = pdfWidth;
  const height = width / ratio;

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(`CV_${data.name.replace(/ /g, '_')}_non_ats.pdf`);
}
