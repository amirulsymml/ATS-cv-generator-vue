import type { CVData } from './types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function esc(value = ''): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function joinParts(parts: string[], separator = ' &nbsp;|&nbsp; '): string {
  return parts.filter(Boolean).join(separator)
}

function dateRange(from: string, to: string): string {
  if (!from && !to) return ''
  return [esc(from), esc(to)].filter(Boolean).join(' &ndash; ')
}

// ─── Section Builders ─────────────────────────────────────────────────────────

function buildHeader(data: CVData): string {
  const name = esc(data.name) || 'Your Name'
  const contacts = joinParts(
    [data.phone, data.email, data.city, data.linkedin].map(esc),
    '<span>|</span>',
  )
  const contactLine = contacts || 'Phone &nbsp;|&nbsp; Email &nbsp;|&nbsp; City, State &nbsp;|&nbsp; LinkedIn'

  return `
    <div class="cv-name">${name}</div>
    <div class="cv-contact">${contactLine}</div>
  `
}

function buildSummary(data: CVData): string {
  if (!data.summary.trim()) return ''
  return `
    <div class="cv-sec-title">Professional Summary</div>
    <div class="cv-summary">${esc(data.summary)}</div>
  `
}

function buildWorkExperience(data: CVData): string {
  const visible = data.jobs.filter(j => j.title || j.company)
  if (!visible.length) return ''

  const items = visible.map(job => {
    const dateStr = dateRange(job.from, job.to)
    const company = joinParts([esc(job.company), esc(job.location)])
    const bullets = job.bullets.filter(b => b.trim())

    return `
      <div class="cv-job">
        <div class="cv-job-hdr">
          <span class="cv-job-title">${esc(job.title) || 'Job Title'}</span>
          ${dateStr ? `<span class="cv-job-date">${dateStr}</span>` : ''}
        </div>
        ${company ? `<div class="cv-job-co">${company}</div>` : ''}
        ${bullets.length ? `<ul>${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
      </div>
    `
  })

  return `
    <div class="cv-sec-title">Work Experience</div>
    ${items.join('')}
  `
}

function buildEducation(data: CVData): string {
  const visible = data.educations.filter(e => e.degree || e.school)
  if (!visible.length) return ''

  const items = visible.map(edu => {
    const dateStr = dateRange(edu.from, edu.to)
    const school = joinParts([esc(edu.school), esc(edu.location)])

    return `
      <div class="cv-edu">
        <div class="cv-edu-hdr">
          <span class="cv-edu-deg">${esc(edu.degree) || 'Degree'}</span>
          ${dateStr ? `<span class="cv-edu-yr">${dateStr}</span>` : ''}
        </div>
        ${school ? `<div class="cv-edu-sch">${school}</div>` : ''}
      </div>
    `
  })

  return `
    <div class="cv-sec-title">Education</div>
    ${items.join('')}
  `
}

function buildSkills(data: CVData): string {
  const visible = data.skills.filter(s => s.label || s.values)
  if (!visible.length) return ''

  const items = visible.map(skill => {
    const label = esc(skill.label)
    const labelWithColon = label && !label.trim().endsWith(':') ? `${label}:` : label
    return `
      <div class="cv-skill-row">
        <span class="cv-skill-lbl">${labelWithColon}</span>
        <span class="cv-skill-val">${esc(skill.values)}</span>
      </div>
    `
  })

  return `
    <div class="cv-sec-title">Technical Skills</div>
    ${items.join('')}
  `
}

function buildCertifications(data: CVData): string {
  const visible = data.certifications.filter(c => c.trim())
  if (!visible.length) return ''

  return `
    <div class="cv-sec-title">Certifications &amp; Training</div>
    <div class="cv-cert">
      <ul>${visible.map(c => `<li>${esc(c)}</li>`).join('')}</ul>
    </div>
  `
}

function buildReferees(data: CVData): string {
  const visible = data.referees.filter(r => r.name || r.role)
  if (!visible.length) return ''

  const items = visible.map(ref => `
    <div class="cv-ref-item">
      ${ref.name ? `<div class="cv-ref-name">${esc(ref.name)}</div>` : ''}
      ${ref.phone ? `<div class="cv-ref-phone">${esc(ref.phone)}</div>` : ''}
      ${ref.role ? `<div class="cv-ref-role">${esc(ref.role)}</div>` : ''}
    </div>
  `)

  return `
    <div class="cv-sec-title">Referees</div>
    <div class="cv-ref-grid">${items.join('')}</div>
  `
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Builds the full CV HTML string from form data.
 * Pure function — no DOM side effects.
 */
export function buildCVHTML(data: CVData): string {
  return [
    buildHeader(data),
    buildSummary(data),
    buildWorkExperience(data),
    buildEducation(data),
    buildSkills(data),
    buildCertifications(data),
    buildReferees(data),
  ].join('')
}