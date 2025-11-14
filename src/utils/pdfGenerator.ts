import type { PortfolioData, ExperienceJob, SkillCategory, ProjectItem, Stat } from '../types/portfolio';
import type { jsPDF as JsPdfInstance } from 'jspdf';

type Lang = 'es' | 'en';

const PAGE_MARGIN = 18;
const LEFT_COLUMN_WIDTH = 62;
const GUTTER = 10;
const RIGHT_LINE_HEIGHT = 5.6;
const LEFT_LINE_HEIGHT = 4.4;
const SANITIZE_LIMIT = 600;

const ACCENT_COLOR = { r: 15, g: 118, b: 110 };
const HEADER_LINE_COLOR = { r: 226, g: 232, b: 240 };
const LEFT_SECTION_BG = { r: 248, g: 250, b: 252 };
const LEFT_SECTION_BORDER = { r: 219, g: 234, b: 254 };
const LEFT_TITLE_COLOR = { r: 15, g: 23, b: 42 };
const LEFT_TEXT_COLOR = { r: 63, g: 71, b: 82 };
const HEADER_BASE_HEIGHT = 48;
const HEADER_PADDING_X = 8;
const HEADER_PADDING_TOP = 16;

const sanitizeText = (value: string | undefined, limit: number = SANITIZE_LIMIT): string =>
  (value ?? '').replace(/[<>"'&]/g, '').slice(0, limit).trim();

const FALLBACK = {
  profile: 'Profile',
  contact: 'Contact',
  links: 'Links',
  highlights: 'Highlights',
  skills: 'Skills',
  projects: 'Projects',
  closing: 'Let’s talk'
};

const TRANSLATIONS: Record<Lang, typeof FALLBACK> = {
  es: {
    profile: 'Perfil',
    contact: 'Contacto',
    links: 'Enlaces',
    highlights: 'Indicadores',
    skills: 'Competencias',
    projects: 'Proyectos',
    closing: 'Contacto'
  },
  en: FALLBACK
};

type ColumnWriters = {
  leftY: number;
  rightY: number;
};

export async function generatePdf(data: PortfolioData, lang: Lang = 'es') {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const translations = TRANSLATIONS[lang] ?? FALLBACK;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const rightColumnWidth = pageWidth - PAGE_MARGIN * 2 - LEFT_COLUMN_WIDTH - GUTTER;
  const rightColumnX = PAGE_MARGIN + LEFT_COLUMN_WIDTH + GUTTER;

  const headerBottom = drawHeader(doc, data, pageWidth);
  const columns: ColumnWriters = {
    leftY: headerBottom + 6,
    rightY: headerBottom + 6
  };

  drawLeftColumn(doc, data, translations, columns);
  drawRightColumn(doc, data, translations, columns, {
    pageHeight,
    pageWidth,
    rightColumnWidth,
    rightColumnX
  });

  const safeName = sanitizeText(data.name).replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  doc.save(`CV_${safeName}_${lang.toUpperCase()}.pdf`);
}

function drawHeader(doc: JsPdfInstance, data: PortfolioData, pageWidth: number): number {
  const name = sanitizeText(data.name);
  const title = sanitizeText(data.title);
  const subtitle = sanitizeText(data.subtitle);
  const tagline = sanitizeText(data.tagline);
  const contentWidth = pageWidth - PAGE_MARGIN * 2;
  const taglineMaxWidth = contentWidth - HEADER_PADDING_X * 2;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  const taglineLines = doc.splitTextToSize(tagline, taglineMaxWidth);

  const headerBgHeight = HEADER_BASE_HEIGHT + taglineLines.length * 4.5;
  doc.setFillColor(ACCENT_COLOR.r, ACCENT_COLOR.g, ACCENT_COLOR.b);
  doc.roundedRect(PAGE_MARGIN, PAGE_MARGIN, contentWidth, headerBgHeight, 4, 4, 'F');

  doc.setDrawColor(ACCENT_COLOR.r + 45, ACCENT_COLOR.g + 70, ACCENT_COLOR.b + 88);
  doc.setLineWidth(0.6);
  doc.roundedRect(PAGE_MARGIN, PAGE_MARGIN, contentWidth, headerBgHeight, 4, 4, 'S');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(name, PAGE_MARGIN + HEADER_PADDING_X, PAGE_MARGIN + HEADER_PADDING_TOP);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text(`${title} • ${subtitle}`, PAGE_MARGIN + HEADER_PADDING_X, PAGE_MARGIN + HEADER_PADDING_TOP + 10);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text(taglineLines, PAGE_MARGIN + HEADER_PADDING_X, PAGE_MARGIN + HEADER_PADDING_TOP + 20);

  const headerBottom = PAGE_MARGIN + headerBgHeight + 6;
  doc.setDrawColor(HEADER_LINE_COLOR.r, HEADER_LINE_COLOR.g, HEADER_LINE_COLOR.b);
  doc.setLineWidth(0.4);
  doc.line(PAGE_MARGIN, headerBottom - 4, pageWidth - PAGE_MARGIN, headerBottom - 4);

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  return headerBottom;
}

function drawLeftColumn(
  doc: JsPdfInstance,
  data: PortfolioData,
  translations: typeof FALLBACK,
  columns: ColumnWriters
) {
  const contactLines = [
    sanitizeText(data.location),
    sanitizeText(data.phone),
    sanitizeText(data.email),
    data.whatsapp ? `WhatsApp: ${sanitizeText(data.whatsapp)}` : undefined
  ].filter(Boolean) as string[];

  const linkLines = [
    data.social.linkedin ? `LinkedIn: ${sanitizeUrl(data.social.linkedin)}` : undefined,
    data.social.github ? `GitHub: ${sanitizeUrl(data.social.github)}` : undefined,
    data.social.portfolio ? `Portfolio: ${sanitizeUrl(data.social.portfolio)}` : undefined
  ].filter(Boolean) as string[];

  const highlightLines = data.stats.map(formatStatLine);
  const skillLines = buildSkillLines(data.sections.skills?.categories ?? []);

  addLeftSection(doc, translations.contact, contactLines, columns);
  addLeftSection(doc, translations.links, linkLines, columns);
  addLeftSection(doc, translations.highlights, highlightLines, columns);
  addLeftSection(doc, translations.skills, skillLines, columns);

  if (columns.leftY > columns.rightY - 10) {
    columns.rightY = Math.max(columns.rightY, columns.leftY - 6);
  }
}

function drawRightColumn(
  doc: JsPdfInstance,
  data: PortfolioData,
  translations: typeof FALLBACK,
  columns: ColumnWriters,
  layout: {
    pageHeight: number;
    pageWidth: number;
    rightColumnWidth: number;
    rightColumnX: number;
  }
) {
  const { pageHeight, pageWidth, rightColumnWidth, rightColumnX } = layout;

  const ensureSpace = (heightNeeded: number) => {
    if (columns.rightY + heightNeeded <= pageHeight - PAGE_MARGIN) {
      return;
    }
    doc.addPage();
    drawContinuationHeader(doc, sanitizeText(data.name), pageWidth);
    columns.rightY = PAGE_MARGIN + 8;
  };

  const addSectionTitle = (title: string) => {
    ensureSpace(8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text(title, rightColumnX, columns.rightY);
    columns.rightY += 6.5;
  };

  const addParagraph = (text: string) => {
    const lines = doc.splitTextToSize(text, rightColumnWidth);
    const blockHeight = lines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(blockHeight);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(lines, rightColumnX, columns.rightY);
    columns.rightY += blockHeight + 2;
  };

  const profileTitle = translations.profile;
  addSectionTitle(profileTitle);
  addParagraph(sanitizeText(data.description));

  if (data.sections?.experience?.jobs?.length) {
    addSectionTitle(sanitizeText(data.sections.experience.title));
    data.sections.experience.jobs.forEach((job: ExperienceJob) => {
      addExperienceEntry(doc, job, ensureSpace, rightColumnX, rightColumnWidth, columns);
    });
  }

  if (data.sections?.projects?.items?.length) {
    addSectionTitle(translations.projects);
    data.sections.projects.items.forEach((project: ProjectItem) => {
      addProjectEntry(doc, project, ensureSpace, rightColumnX, rightColumnWidth, columns);
    });
  }

  if (data.sections?.contact) {
    addSectionTitle(translations.closing);
    addParagraph(sanitizeText(data.sections.contact.subtitle));
    addParagraph(sanitizeText(data.sections.contact.closing));
    addParagraph(sanitizeText(data.sections.contact.signature));
  }
}

function addLeftSection(doc: JsPdfInstance, title: string, lines: string[], columns: ColumnWriters) {
  if (!lines.length) return;

  const sanitizedLines = lines.map(line => sanitizeText(line));

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const textBlocks = sanitizedLines.map(line => doc.splitTextToSize(line, LEFT_COLUMN_WIDTH));
  const contentHeight = textBlocks.reduce(
    (sum, block) => sum + block.length * LEFT_LINE_HEIGHT,
    0
  );

  const sectionTop = columns.leftY;
  const sectionHeight = 5 + contentHeight + 8;

  doc.setFillColor(LEFT_SECTION_BG.r, LEFT_SECTION_BG.g, LEFT_SECTION_BG.b);
  doc.roundedRect(PAGE_MARGIN - 2, sectionTop - 1.5, LEFT_COLUMN_WIDTH + 4, sectionHeight, 3, 3, 'F');
  doc.setDrawColor(LEFT_SECTION_BORDER.r, LEFT_SECTION_BORDER.g, LEFT_SECTION_BORDER.b);
  doc.setLineWidth(0.3);
  doc.roundedRect(PAGE_MARGIN - 2, sectionTop - 1.5, LEFT_COLUMN_WIDTH + 4, sectionHeight, 3, 3, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(LEFT_TITLE_COLOR.r, LEFT_TITLE_COLOR.g, LEFT_TITLE_COLOR.b);
  doc.text(title, PAGE_MARGIN, columns.leftY + 4);
  columns.leftY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(LEFT_TEXT_COLOR.r, LEFT_TEXT_COLOR.g, LEFT_TEXT_COLOR.b);

  textBlocks.forEach(block => {
    doc.text(block, PAGE_MARGIN, columns.leftY);
    columns.leftY += block.length * LEFT_LINE_HEIGHT;
  });

  columns.leftY += 8;

  doc.setTextColor(0, 0, 0);
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.hostname}${parsed.pathname !== '/' ? parsed.pathname : ''}`;
  } catch {
    return sanitizeText(url);
  }
}

function formatStatLine(stat: Stat): string {
  return `${sanitizeText(stat.value)} — ${sanitizeText(stat.label)}`;
}

function buildSkillLines(categories: readonly SkillCategory[]): string[] {
  return categories.map(category => {
    const items = category.items.map(item => sanitizeText(item)).join(' • ');
    return `${sanitizeText(category.title)}: ${items}`;
  });
}

function addExperienceEntry(
  doc: JsPdfInstance,
  job: ExperienceJob,
  ensureSpace: (height: number) => void,
  x: number,
  width: number,
  columns: ColumnWriters
) {
  const roleLine = `${sanitizeText(job.role)}`;
  const companyLine = `${sanitizeText(job.company)} • ${sanitizeText(job.period)}`;
  const description = sanitizeText(job.description);
  const tagsLine = job.tags?.length ? `Skills: ${job.tags.map(tag => sanitizeText(tag)).join(' • ')}` : '';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  ensureSpace(RIGHT_LINE_HEIGHT * 2);
  doc.text(roleLine, x, columns.rightY);
  columns.rightY += RIGHT_LINE_HEIGHT;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text(companyLine, x, columns.rightY);
  columns.rightY += RIGHT_LINE_HEIGHT;

  if (description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const descriptionLines = doc.splitTextToSize(description, width);
    const descriptionHeight = descriptionLines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(descriptionHeight);
    doc.text(descriptionLines, x, columns.rightY);
    columns.rightY += descriptionHeight;
  }

  if (tagsLine) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const tagLines = doc.splitTextToSize(tagsLine, width);
    const tagHeight = tagLines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(tagHeight);
    doc.text(tagLines, x, columns.rightY);
    columns.rightY += tagHeight;
  }

  columns.rightY += 3;
}

function addProjectEntry(
  doc: JsPdfInstance,
  project: ProjectItem,
  ensureSpace: (height: number) => void,
  x: number,
  width: number,
  columns: ColumnWriters
) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  const title = sanitizeText(project.title);
  ensureSpace(RIGHT_LINE_HEIGHT);
  doc.text(title, x, columns.rightY);
  columns.rightY += RIGHT_LINE_HEIGHT;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);

  if (project.description) {
    const descLines = doc.splitTextToSize(sanitizeText(project.description), width);
    const descHeight = descLines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(descHeight);
    doc.text(descLines, x, columns.rightY);
    columns.rightY += descHeight;
  }

  if (project.tags?.length) {
    const tagsText = `Tags: ${project.tags.map(tag => sanitizeText(tag)).join(' • ')}`;
    const tagLines = doc.splitTextToSize(tagsText, width);
    const tagHeight = tagLines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(tagHeight);
    doc.text(tagLines, x, columns.rightY);
    columns.rightY += tagHeight;
  }

  if (project.link) {
    const linkText = sanitizeUrl(project.link);
    const linkLines = doc.splitTextToSize(`Link: ${linkText}`, width);
    const linkHeight = linkLines.length * RIGHT_LINE_HEIGHT;
    ensureSpace(linkHeight);
    doc.text(linkLines, x, columns.rightY);
    columns.rightY += linkHeight;
  }

  columns.rightY += 3;
}

function drawContinuationHeader(doc: JsPdfInstance, name: string, pageWidth: number) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(name, PAGE_MARGIN, PAGE_MARGIN);
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.line(PAGE_MARGIN, PAGE_MARGIN + 2, pageWidth - PAGE_MARGIN, PAGE_MARGIN + 2);
}
