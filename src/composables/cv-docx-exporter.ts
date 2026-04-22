import {
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Document,
  Packer,
  Paragraph,
  TabStopType,
  TextRun,
} from 'docx'
import type { CVData, Referee } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_MARGIN_INCHES = { top: 0.71, right: 0.79, bottom: 0.71, left: 0.79 }
const SECTION_BORDER = {
  bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface RunOptions {
  bold?: boolean
  italic?: boolean
  /** Font size in pt (will be doubled for half-pt units internally) */
  size?: number
  color?: string
  font?: string
}

function run(text = '', options: RunOptions = {}): TextRun {
  return new TextRun({
    text,
    bold: options.bold,
    italics: options.italic,
    size: options.size ? options.size * 2 : undefined,
    color: options.color,
    font: options.font || 'Aptos',
  })
}

function sectionHeading(label: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 100 },
    border: SECTION_BORDER,
    children: [run(label, { bold: true, size: 12 })],
  })
}

function dateRange(from: string, to: string): string {
  return [from, to].filter(Boolean).join(' – ')
}

function joinParts(parts: string[]): string {
  return parts.filter(Boolean).join('  |  ')
}

// ─── Section Builders ─────────────────────────────────────────────────────────

function buildHeader(data: CVData): Paragraph[] {
  const paragraphs: Paragraph[] = []

  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100, line: 230 },
      children: [run(data.name || 'Your Name', { bold: true, size: 22, color: '111111' })],
    }),
  )

  const contactLine = joinParts([data.phone, data.email, data.city, data.linkedin])
  if (contactLine) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240, line: 330 },
        children: [run(contactLine, { size: 11, color: '333333' })],
      }),
    )
  }

  return paragraphs
}

function buildSummary(data: CVData): Paragraph[] {
  if (!data.summary.trim()) return []

  return [
    sectionHeading('PROFESSIONAL SUMMARY'),
    new Paragraph({
      spacing: { after: 160, line: 310 },
      alignment: AlignmentType.JUSTIFIED,
      children: [run(data.summary, { size: 11, color: '1a1a1a' })],
    }),
  ]
}

function buildWorkExperience(data: CVData): Paragraph[] {
  const visible = data.jobs.filter(j => j.title || j.company)
  if (!visible.length) return []

  const paragraphs: Paragraph[] = [sectionHeading('WORK EXPERIENCE')]

  for (const job of visible) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 20, line: 240 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9072 }],
        children: [
          run(job.title || 'Job Title', { bold: true, size: 11, color: '111111' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(dateRange(job.from, job.to), { size: 10, color: '555555' }),
        ],
      }),
    )

    const company = joinParts([job.company, job.location])
    if (company) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40, line: 220 },
          children: [run(company, { italic: true, size: 11, color: '444444' })],
        }),
      )
    }

    for (const bullet of job.bullets.filter(b => b.trim())) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40, line: 290 },
          bullet: { level: 0 },
          indent: { left: 240, hanging: 240 },
          alignment: AlignmentType.JUSTIFIED,
          children: [run(bullet, { size: 11, color: '1a1a1a' })],
        }),
      )
    }

    // paragraphs.push(
    //   new Paragraph({ spacing: { after: 160 }, children: [new TextRun('')] }),
    // )
  }

  return paragraphs
}

function buildEducation(data: CVData): Paragraph[] {
  const visible = data.educations.filter(e => e.degree || e.school)
  if (!visible.length) return []

  const paragraphs: Paragraph[] = [sectionHeading('EDUCATION')]

  for (const edu of visible) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 80, after: 20, line: 240 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9072 }],
        children: [
          run(edu.degree || 'Degree', { bold: true, size: 11, color: '111111' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(dateRange(edu.from, edu.to), { size: 10, color: '555555' }),
        ],
      }),
    )

    const school = joinParts([edu.school, edu.location])
    if (school) {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 120, line: 220 },
          children: [run(school, { italic: true, size: 11, color: '444444' })],
        }),
      )
    }
  }

  return paragraphs
}

function buildSkills(data: CVData): Paragraph[] {
  const visible = data.skills.filter(s => s.label || s.values)
  if (!visible.length) return []

  const paragraphs: Paragraph[] = [sectionHeading('TECHNICAL SKILLS')]

  for (const skill of visible) {
    const label = skill.label && !skill.label.trim().endsWith(':')
      ? `${skill.label}:`
      : skill.label

    paragraphs.push(
      new Paragraph({
        spacing: { after: 40, line: 220 },
        tabStops: [{ type: TabStopType.LEFT, position: 3000 }],
        children: [
          run(label, { bold: true, size: 11, color: '111111' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(skill.values, { size: 11, color: '1a1a1a' }),
        ],
      }),
    )
  }

  return paragraphs
}

function buildCertifications(data: CVData): Paragraph[] {
  const visible = data.certifications.filter(c => c.trim())
  if (!visible.length) return []

  const paragraphs: Paragraph[] = [sectionHeading('CERTIFICATIONS & TRAINING')]

  for (const cert of visible) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 40, line: 290 },
        bullet: { level: 0 },
        alignment: AlignmentType.JUSTIFIED,
        children: [run(cert, { size: 11, color: '1a1a1a' })],
      }),
    )
  }

  return paragraphs
}

function buildReferees(data: CVData): Paragraph[] {
  const visible = data.referees.filter(r => r.name || r.role)
  if (!visible.length) return []

  const paragraphs: Paragraph[] = [sectionHeading('REFEREES')]

  for (let i = 0; i < visible.length; i += 2) {
    const r1 = visible[i]
    const r2: Partial<Referee> = visible[i + 1] ?? {}
    const TAB_STOP = [{ type: TabStopType.LEFT, position: 4536 }]

    paragraphs.push(
      new Paragraph({
        spacing: { before: 40, after: 20, line: 240 },
        tabStops: TAB_STOP,
        children: [
          run(r1.name ?? '', { bold: true, size: 11, color: '111111' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(r2.name ?? '', { bold: true, size: 11, color: '111111' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 20, line: 220 },
        tabStops: TAB_STOP,
        children: [
          run(r1.phone ?? '', { size: 11, color: '444444' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(r2.phone ?? '', { size: 11, color: '444444' }),
        ],
      }),
      new Paragraph({
        spacing: { after: 40, line: 280 },
        tabStops: TAB_STOP,
        children: [
          run(r1.role ?? '', { italic: true, size: 10, color: '555555' }),
          new TextRun({ text: '\t', font: 'Aptos' }),
          run(r2.role ?? '', { italic: true, size: 10, color: '555555' }),
        ],
      }),
    )
  }

  return paragraphs
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generates and triggers a browser download of a .docx CV file.
 */
export async function downloadDocx(data: CVData): Promise<void> {
  const allParagraphs = [
    ...buildHeader(data),
    ...buildSummary(data),
    ...buildWorkExperience(data),
    ...buildEducation(data),
    ...buildSkills(data),
    ...buildCertifications(data),
    ...buildReferees(data),
  ]

  const doc = new Document({
    sections: [
      {
        children: allParagraphs,
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(PAGE_MARGIN_INCHES.top),
              right: convertInchesToTwip(PAGE_MARGIN_INCHES.right),
              bottom: convertInchesToTwip(PAGE_MARGIN_INCHES.bottom),
              left: convertInchesToTwip(PAGE_MARGIN_INCHES.left),
            },
          },
        },
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  const filename = (data.name || 'CV').replace(/\s+/g, '_') + '_CV.docx'

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()

  // Clean up the object URL after the download is triggered
  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}