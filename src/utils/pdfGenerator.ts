import type { PortfolioData, ExperienceJob, SkillCategory } from '../types/portfolio';
type Lang = 'es' | 'en';

const LINE_HEIGHT = 5;
const SECTION_TITLE_GAP = 6;
const BLOCK_SPACING = 4;
const PAGE_MARGIN = 20;
const SANITIZE_LIMIT = 500;

const sanitizeText = (value: string, limit: number = SANITIZE_LIMIT): string =>
  value.replace(/[<>"'&]/g, '').slice(0, limit).trim();

const TRANSLATIONS: Record<Lang, Record<string, string>> = {
  es: {
    profile: 'Perfil'
  },
  en: {
    profile: 'Profile'
  }
};

export async function generatePdf(data: PortfolioData, lang: Lang = 'es') {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  let cursorY = PAGE_MARGIN + 2;

  let currentSectionTitle: string | null = null;

  const ensureSpace = (heightNeeded: number) => {
    if (cursorY + heightNeeded > pageHeight - PAGE_MARGIN) {
      doc.addPage();
      cursorY = PAGE_MARGIN + 2;
      if (currentSectionTitle) {
        drawSectionTitle(currentSectionTitle);
      }
    }
  };

  const drawTextBlock = (text: string | string[], indent = 0, lineHeight = LINE_HEIGHT) => {
    const cleaned = Array.isArray(text)
      ? text.map(item => sanitizeText(item))
      : sanitizeText(text);
    const lines = Array.isArray(cleaned) ? cleaned : doc.splitTextToSize(cleaned, contentWidth - indent);
    const blockHeight = lines.length * lineHeight;
    ensureSpace(blockHeight);
    doc.text(lines, PAGE_MARGIN + indent, cursorY);
    cursorY += blockHeight;
  };

  const drawSectionTitle = (title: string) => {
    currentSectionTitle = title;
    ensureSpace(SECTION_TITLE_GAP);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, PAGE_MARGIN, cursorY);
    cursorY += SECTION_TITLE_GAP;
  };

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  drawTextBlock(sanitizeText(data.name), 0, 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  drawTextBlock(`${sanitizeText(data.title)} — ${sanitizeText(data.subtitle)}`, 0, 6);

  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  ensureSpace(8);
  doc.line(PAGE_MARGIN, cursorY, pageWidth - PAGE_MARGIN, cursorY);
  cursorY += 8;

  // Profile
  drawSectionTitle(TRANSLATIONS[lang]?.profile ?? TRANSLATIONS.es.profile);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  drawTextBlock(sanitizeText(data.description), 0, 4.5);
  cursorY += BLOCK_SPACING;

  // Experience
  if (data.sections?.experience?.jobs?.length) {
    drawSectionTitle(sanitizeText(data.sections.experience.title));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    data.sections.experience.jobs.forEach((job: ExperienceJob) => {
      const header = `${sanitizeText(job.role)} — ${sanitizeText(job.company)} (${sanitizeText(job.period)})`;
      ensureSpace(LINE_HEIGHT * 2);
      doc.setFont('helvetica', 'bold');
      doc.text(header, PAGE_MARGIN, cursorY);
      cursorY += LINE_HEIGHT;

      doc.setFont('helvetica', 'normal');
      drawTextBlock(sanitizeText(job.description), 2, 4.5);
      cursorY += BLOCK_SPACING;
    });
  }

  // Skills
  if (data.sections?.skills?.categories?.length) {
    cursorY += BLOCK_SPACING;
    drawSectionTitle(sanitizeText(data.sections.skills.title));
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    data.sections.skills.categories.forEach((category: SkillCategory) => {
      const sanitizedItems = category.items.map(item => sanitizeText(item));
      const line = `${sanitizeText(category.title)}: ${sanitizedItems.join(' • ')}`;
      drawTextBlock(line, 0, 4.5);
      cursorY += 1;
    });
  }

  const safe = sanitizeText(data.name).replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  doc.save(`CV_${safe}_${lang.toUpperCase()}.pdf`);
}
