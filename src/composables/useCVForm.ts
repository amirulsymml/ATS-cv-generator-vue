import { reactive, ref, watch, nextTick } from 'vue'

export interface Job {
  title: string
  company: string
  location: string
  from: string
  to: string
  bullets: string[]
}

export interface Education {
  degree: string
  school: string
  location: string
  from: string
  to: string
}

export interface Skill {
  label: string
  values: string
}

export interface Referee {
  name: string
  phone: string
  role: string
}

export interface CVFormData {
  name: string
  phone: string
  email: string
  city: string
  linkedin: string
  summary: string
  jobs: Job[]
  edus: Education[]
  skills: Skill[]
  certs: string[]
  refs: Referee[]
}

const CONTENT_HEIGHT = 987

export function useCVForm() {
  const form = reactive<CVFormData>({
    name: '',
    phone: '',
    email: '',
    city: '',
    linkedin: '',
    summary: '',
    jobs: [{ title: '', company: '', location: '', from: '', to: '', bullets: ['', ''] }],
    edus: [{ degree: '', school: '', location: '', from: '', to: '' }],
    skills: [
      { label: 'Programming Languages', values: '' },
      { label: 'Frameworks & Technologies', values: '' },
      { label: 'Data & BI Tools', values: '' },
      { label: 'Soft Skills', values: '' }
    ],
    certs: [''],
    refs: [
      { name: '', phone: '', role: '' },
      { name: '', phone: '', role: '' }
    ]
  })

  const previewScroll = ref<HTMLElement | null>(null)
  const previewContainer = ref<HTMLElement | null>(null)
  const pageCount = ref(0)

  function esc(s: string = ''): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }

  function buildCVHTML(): string {
    let h = ''

    h += '<div class="cv-name">' + (esc(form.name) || 'Your Name') + '</div>'

    const contacts = [form.phone, form.email, form.city, form.linkedin].filter(Boolean)
    h +=
      '<div class="cv-contact">' +
      (contacts.length
        ? contacts.map(esc).join('<span>|</span>')
        : 'Phone &nbsp;|&nbsp; Email &nbsp;|&nbsp; City, State &nbsp;|&nbsp; LinkedIn') +
      '</div>'

    if (form.summary.trim()) {
      h += '<div class="cv-sec-title">Professional Summary</div>'
      h += '<div class="cv-summary">' + esc(form.summary) + '</div>'
    }

    const visibleJobs = form.jobs.filter((j) => j.title || j.company)
    if (visibleJobs.length) {
      h += '<div class="cv-sec-title">Work Experience</div>'
      visibleJobs.forEach((j) => {
        h +=
          '<div class="cv-job"><div class="cv-job-hdr"><span class="cv-job-title">' +
          (esc(j.title) || 'Job Title') +
          '</span>'
        if (j.from || j.to)
          h += '<span class="cv-job-date">' + esc(j.from) + (j.from && j.to ? ' &ndash; ' : '') + esc(j.to) + '</span>'
        h += '</div>'
        const co = [esc(j.company), esc(j.location)].filter(Boolean).join(' &nbsp;|&nbsp; ')
        if (co) h += '<div class="cv-job-co">' + co + '</div>'
        const buls = j.bullets.filter((b) => b.trim())
        if (buls.length) h += '<ul>' + buls.map((b) => '<li>' + esc(b) + '</li>').join('') + '</ul>'
        h += '</div>'
      })
    }

    const visibleEdus = form.edus.filter((e) => e.degree || e.school)
    if (visibleEdus.length) {
      h += '<div class="cv-sec-title">Education</div>'
      visibleEdus.forEach((e) => {
        h +=
          '<div class="cv-edu"><div class="cv-edu-hdr"><span class="cv-edu-deg">' +
          (esc(e.degree) || 'Degree') +
          '</span>'
        if (e.from || e.to)
          h += '<span class="cv-edu-yr">' + esc(e.from) + (e.from && e.to ? ' &ndash; ' : '') + esc(e.to) + '</span>'
        h += '</div>'
        const sc = [esc(e.school), esc(e.location)].filter(Boolean).join(' &nbsp;|&nbsp; ')
        if (sc) h += '<div class="cv-edu-sch">' + sc + '</div>'
        h += '</div>'
      })
    }

    const visibleSkills = form.skills.filter((s) => s.label || s.values)
    if (visibleSkills.length) {
      h += '<div class="cv-sec-title">Technical Skills</div>'
      visibleSkills.forEach((s) => {
        const lbl = esc(s.label) + (s.label && !s.label.trim().endsWith(':') ? ':' : '')
        h += '<div class="cv-skill-row"><span class="cv-skill-lbl">' + lbl + '</span><span class="cv-skill-val">' + esc(s.values) + '</span></div>'
      })
    }

    const visibleCerts = form.certs.filter((c) => c.trim())
    if (visibleCerts.length) {
      h += '<div class="cv-sec-title">Certifications &amp; Training</div>'
      h += '<div class="cv-cert"><ul>' + visibleCerts.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ul></div>'
    }

    const visibleRefs = form.refs.filter((r) => r.name || r.role)
    if (visibleRefs.length) {
      h += '<div class="cv-sec-title">Referees</div><div class="cv-ref-grid">'
      visibleRefs.forEach((r) => {
        h += '<div class="cv-ref-item">'
        if (r.name) h += '<div class="cv-ref-name">' + esc(r.name) + '</div>'
        if (r.phone) h += '<div class="cv-ref-phone">' + esc(r.phone) + '</div>'
        if (r.role) h += '<div class="cv-ref-role">' + esc(r.role) + '</div>'
        h += '</div>'
      })
      h += '</div>'
    }

    return h
  }

  function render() {
    nextTick(() => {
      let m = document.getElementById('cv_measurer')
      if (!m) {
        m = document.createElement('div')
        m.id = 'cv_measurer'
        m.className = 'cv-page'
        m.style.cssText =
          'position:fixed;left:-9999px;top:0;visibility:hidden;max-height:none!important;min-height:unset!important;height:auto!important;overflow:visible!important;'
        document.body.appendChild(m)
      }
      m.innerHTML = buildCVHTML()

      const children = Array.from(m.children)
      const pages: Element[][] = []
      let cur: Element[] = []
      let curH = 0

      children.forEach((node) => {
        const h = node.getBoundingClientRect().height + 4
        if (curH + h > CONTENT_HEIGHT && cur.length > 0) {
          pages.push(cur)
          cur = [node.cloneNode(true) as Element]
          curH = h
        } else {
          cur.push(node.cloneNode(true) as Element)
          curH += h
        }
      })

      if (cur.length) pages.push(cur)

      const container = previewContainer.value
      if (!container) return

      container.innerHTML = ''

      pages.forEach((pNodes, idx) => {
        if (pages.length > 1) {
          const lbl = document.createElement('div')
          lbl.style.cssText =
            'font-size:10px;color:var(--text-muted);letter-spacing:0.1em;text-transform:uppercase;align-self:flex-start;margin-bottom:-8px;'
          lbl.textContent = 'Page ' + (idx + 1) + ' of ' + pages.length
          container.appendChild(lbl)
        }

        const pg = document.createElement('div')
        pg.className = 'cv-page'
        if (idx > 0) {
          pg.style.minHeight = 'auto'
          pg.style.overflow = 'visible'
        }
        pNodes.forEach((n) => pg.appendChild(n))
        container.appendChild(pg)
      })

      pageCount.value = pages.length > 1 ? pages.length : 0
      scalePreview()
    })
  }

  function scalePreview() {
    const scroll = previewScroll.value
    const wrap = previewContainer.value
    if (!scroll || !wrap) return

    const scale = Math.min(1, (scroll.clientWidth - 48) / 794)
    wrap.style.transform = 'scale(' + scale + ')'
    wrap.style.transformOrigin = 'top center'

    const nH = wrap.scrollHeight
    const sH = nH * scale
    const sW = 794 * scale
    const oX = (sW - 794) / 2

    wrap.style.marginLeft = oX + 'px'
    wrap.style.marginRight = oX + 'px'
    wrap.style.marginBottom = sH - nH + 'px'
  }

  watch(() => form, render, { deep: true })

  window.addEventListener('resize', scalePreview)

  const addJob = () => {
    form.jobs.push({ title: '', company: '', location: '', from: '', to: '', bullets: ['', ''] })
  }

  const removeJob = (i: number) => {
    form.jobs.splice(i, 1)
  }

  const addBullet = (i: number) => {
    form.jobs[i].bullets.push('')
  }

  const removeBullet = (i: number, bi: number) => {
    form.jobs[i].bullets.splice(bi, 1)
  }

  const addEdu = () => {
    form.edus.push({ degree: '', school: '', location: '', from: '', to: '' })
  }

  const removeEdu = (i: number) => {
    form.edus.splice(i, 1)
  }

  const addSkill = () => {
    form.skills.push({ label: '', values: '' })
  }

  const removeSkill = (i: number) => {
    form.skills.splice(i, 1)
  }

  const addCert = () => {
    form.certs.push('')
  }

  const removeCert = (i: number) => {
    form.certs.splice(i, 1)
  }

  const addRef = () => {
    if (form.refs.length >= 4) return
    form.refs.push({ name: '', phone: '', role: '' })
  }

  const removeRef = (i: number) => {
    form.refs.splice(i, 1)
  }

  const printPDF = () => {
    const content = buildCVHTML()
    const element = document.createElement('div')
    element.innerHTML = content

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const html2pdf = (window as any).html2pdf

    const opt = {
      margin: 18,
      filename: (form.name || 'CV').replace(/\s+/g, '_') + '_CV.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }

    html2pdf().set(opt).from(element).save()
  }

  const downloadDOCX = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docxLib = (window as any).docx || (window as any).Document
      if (!docxLib) {
        alert('docx library failed to load. Please refresh the page and try again.')
        return
      }

      const Document = docxLib.Document || docxLib
      const Packer = docxLib.Packer
      const Paragraph = docxLib.Paragraph
      const TextRun = docxLib.TextRun
      const AlignmentType = docxLib.AlignmentType
      const BorderStyle = docxLib.BorderStyle
      const convertInchesToTwip = docxLib.convertInchesToTwip
      const TabStopType = docxLib.TabStopType

      if (!Document || !Packer || !Paragraph || !TextRun) {
        alert('docx library components not found. Please refresh the page.')
        return
      }

      const name = form.name || 'Your Name'
      const { phone, email, city, linkedin, summary } = form
      const sections = []

      const createRun = (text: string = '', options: Record<string, unknown> = {}) => {
        return new TextRun({
          text: text || '',
          bold: options.bold || false,
          italic: options.italic || false,
          size: options.size ? (options.size as number) * 2 : undefined,
          color: options.color as string | undefined
        })
      }

      sections.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [createRun(name, { bold: true, size: 22 })]
        })
      )

      const contacts = [phone, email, city, linkedin].filter(Boolean).join('  |  ')
      if (contacts) {
        sections.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 },
            children: [createRun(contacts, { size: 11, color: '333333' })]
          })
        )
      }

      if (summary.trim()) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('PROFESSIONAL SUMMARY', { bold: true, size: 9 })]
          })
        )
        sections.push(
          new Paragraph({
            spacing: { after: 160 },
            children: [createRun(summary, { size: 12 })]
          })
        )
      }

      const visibleJobs = form.jobs.filter((j) => j.title || j.company)
      if (visibleJobs.length) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('WORK EXPERIENCE', { bold: true, size: 9 })]
          })
        )

        visibleJobs.forEach((j) => {
          const dateStr = [j.from, j.to].filter(Boolean).join(' – ')
          sections.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                createRun(j.title || 'Job Title', { bold: true, size: 12 }),
                new TextRun({ text: '\t' }),
                createRun(dateStr, { size: 10, color: '555555' })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: 9072 }]
            })
          )

          const company = [j.company, j.location].filter(Boolean).join('  |  ')
          if (company) {
            sections.push(
              new Paragraph({
                spacing: { after: 40 },
                children: [createRun(company, { italic: true, size: 11, color: '444444' })]
              })
            )
          }

          j.bullets
            .filter((b) => b.trim())
            .forEach((bullet) => {
              sections.push(
                new Paragraph({
                  spacing: { after: 40 },
                  bullet: { level: 0 },
                  children: [createRun(bullet, { size: 11 })]
                })
              )
            })

          sections.push(new Paragraph({ spacing: { after: 160 }, children: [new TextRun('')] }))
        })
      }

      const visibleEdus = form.edus.filter((e) => e.degree || e.school)
      if (visibleEdus.length) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('EDUCATION', { bold: true, size: 9 })]
          })
        )

        visibleEdus.forEach((e) => {
          const yearStr = [e.from, e.to].filter(Boolean).join(' – ')
          sections.push(
            new Paragraph({
              spacing: { before: 80, after: 20 },
              children: [
                createRun(e.degree || 'Degree', { bold: true, size: 12 }),
                new TextRun({ text: '\t' }),
                createRun(yearStr, { size: 10, color: '555555' })
              ],
              tabStops: [{ type: TabStopType.RIGHT, position: 9072 }]
            })
          )

          const school = [e.school, e.location].filter(Boolean).join('  |  ')
          if (school) {
            sections.push(
              new Paragraph({
                spacing: { after: 120 },
                children: [createRun(school, { italic: true, size: 11, color: '444444' })]
              })
            )
          }
        })
      }

      const visibleSkills = form.skills.filter((s) => s.label || s.values)
      if (visibleSkills.length) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('TECHNICAL SKILLS', { bold: true, size: 9 })]
          })
        )

        visibleSkills.forEach((s) => {
          const lbl = s.label + (s.label && !s.label.trim().endsWith(':') ? ':' : '')
          sections.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                createRun(lbl, { bold: true, size: 11 }),
                new TextRun({ text: '\t' }),
                createRun(s.values, { size: 11 })
              ],
              tabStops: [{ type: TabStopType.LEFT, position: 3000 }]
            })
          )
        })
      }

      const visibleCerts = form.certs.filter((c) => c.trim())
      if (visibleCerts.length) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('CERTIFICATIONS & TRAINING', { bold: true, size: 9 })]
          })
        )

        visibleCerts.forEach((c) => {
          sections.push(
            new Paragraph({
              spacing: { after: 40 },
              bullet: { level: 0 },
              children: [createRun(c, { size: 11 })]
            })
          )
        })
      }

      const visibleRefs = form.refs.filter((r) => r.name || r.role)
      if (visibleRefs.length) {
        sections.push(
          new Paragraph({
            spacing: { before: 200, after: 100 },
            border: { bottom: { color: '111111', space: 1, style: BorderStyle.SINGLE, size: 6 } },
            children: [createRun('REFEREES', { bold: true, size: 9 })]
          })
        )

        for (let i = 0; i < visibleRefs.length; i += 2) {
          const r1 = visibleRefs[i]
          const r2 = visibleRefs[i + 1] || ({} as Referee)

          sections.push(
            new Paragraph({
              spacing: { before: 40, after: 20 },
              children: [
                createRun(r1.name || '', { bold: true, size: 12 }),
                new TextRun({ text: '\t' }),
                createRun(r2.name || '', { bold: true, size: 12 })
              ],
              tabStops: [{ type: TabStopType.LEFT, position: 4536 }]
            })
          )

          sections.push(
            new Paragraph({
              spacing: { after: 20 },
              children: [
                createRun(r1.phone || '', { size: 11, color: '444444' }),
                new TextRun({ text: '\t' }),
                createRun(r2.phone || '', { size: 11, color: '444444' })
              ],
              tabStops: [{ type: TabStopType.LEFT, position: 4536 }]
            })
          )

          sections.push(
            new Paragraph({
              spacing: { after: 40 },
              children: [
                createRun(r1.role || '', { italic: true, size: 10, color: '555555' }),
                new TextRun({ text: '\t' }),
                createRun(r2.role || '', { italic: true, size: 10, color: '555555' })
              ],
              tabStops: [{ type: TabStopType.LEFT, position: 4536 }]
            })
          )
        }
      }

      const doc = new Document({
        sections: [
          {
            children: sections,
            properties: {
              page: {
                margin: {
                  top: convertInchesToTwip(0.71),
                  right: convertInchesToTwip(0.79),
                  bottom: convertInchesToTwip(0.71),
                  left: convertInchesToTwip(0.79)
                }
              }
            }
          }
        ]
      })

      const blob = await Packer.toBlob(doc)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = (form.name || 'CV').replace(/\s+/g, '_') + '_CV.docx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      console.error('Error in downloadDOCX:', err)
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const clearAll = () => {
    if (!confirm('Clear all fields and start fresh?')) return
    form.name = ''
    form.phone = ''
    form.email = ''
    form.city = ''
    form.linkedin = ''
    form.summary = ''
    form.jobs = [{ title: '', company: '', location: '', from: '', to: '', bullets: ['', ''] }]
    form.edus = [{ degree: '', school: '', location: '', from: '', to: '' }]
    form.skills = [
      { label: 'Programming Languages', values: '' },
      { label: 'Frameworks & Technologies', values: '' },
      { label: 'Data & BI Tools', values: '' },
      { label: 'Soft Skills', values: '' }
    ]
    form.certs = ['']
    form.refs = [
      { name: '', phone: '', role: '' },
      { name: '', phone: '', role: '' }
    ]
  }

  nextTick(() => render())

  return {
    form,
    previewScroll,
    previewContainer,
    pageCount,
    addJob,
    removeJob,
    addBullet,
    removeBullet,
    addEdu,
    removeEdu,
    addSkill,
    removeSkill,
    addCert,
    removeCert,
    addRef,
    removeRef,
    printPDF,
    downloadDOCX,
    clearAll,
    scalePreview
  }
}
