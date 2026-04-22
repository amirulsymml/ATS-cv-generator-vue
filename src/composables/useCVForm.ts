import { nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { defaultCVData, defaultEducation, defaultJob, defaultReferee } from './types'
import { renderCVPreview, scaleCVPreview } from './cv-preview-renderer'
import { downloadDocx } from './cv-docx-exporter'
import { openPrintWindow } from './cv-print'

// ─── Composable ───────────────────────────────────────────────────────────────

export function useCVForm() {
  // ── State ──────────────────────────────────────────────────────────────────

  const form = reactive(defaultCVData())
  const previewScroll = ref<HTMLElement | null>(null)
  const previewContainer = ref<HTMLElement | null>(null)
  const pageCount = ref(0)

  // ── Preview Rendering ──────────────────────────────────────────────────────

  function render(): void {
    nextTick(() => {
      const container = previewContainer.value
      if (!container) return
      pageCount.value = renderCVPreview(form, container)
      scalePreview()
    })
  }

  function scalePreview(): void {
    const scroll = previewScroll.value
    const container = previewContainer.value
    if (!scroll || !container) return
    scaleCVPreview(scroll, container)
  }

  // Reactively re-render whenever form data changes
  watch(() => form, render, { deep: true })

  // Scale on window resize
  window.addEventListener('resize', scalePreview)
  onUnmounted(() => window.removeEventListener('resize', scalePreview))

  // Initial render
  nextTick(render)

  // ── Job Actions ────────────────────────────────────────────────────────────

  function addJob(): void {
    form.jobs.push(defaultJob())
  }

  function removeJob(index: number): void {
    form.jobs.splice(index, 1)
  }

  function addBullet(jobIndex: number): void {
    form.jobs[jobIndex].bullets.push('')
  }

  function removeBullet(jobIndex: number, bulletIndex: number): void {
    form.jobs[jobIndex].bullets.splice(bulletIndex, 1)
  }

  // ── Education Actions ──────────────────────────────────────────────────────

  function addEducation(): void {
    form.educations.push(defaultEducation())
  }

  function removeEducation(index: number): void {
    form.educations.splice(index, 1)
  }

  // ── Skill Actions ──────────────────────────────────────────────────────────

  function addSkill(): void {
    form.skills.push({ label: '', values: '' })
  }

  function removeSkill(index: number): void {
    form.skills.splice(index, 1)
  }

  // ── Certification Actions ──────────────────────────────────────────────────

  function addCertification(): void {
    form.certifications.push('')
  }

  function removeCertification(index: number): void {
    form.certifications.splice(index, 1)
  }

  // ── Referee Actions ────────────────────────────────────────────────────────

  function addReferee(): void {
    if (form.referees.length >= 4) return
    form.referees.push(defaultReferee())
  }

  function removeReferee(index: number): void {
    form.referees.splice(index, 1)
  }

  // ── Export Actions ─────────────────────────────────────────────────────────

  function printPDF(): void {
    const container = previewContainer.value
    if (!container) return
    openPrintWindow(container, form.name || 'CV')
  }

  async function exportDocx(): Promise<void> {
    try {
      await downloadDocx(form)
    } catch (err) {
      console.error('[useCVForm] DOCX export failed:', err)
      alert('Failed to generate DOCX: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  function clearAll(): void {
    if (!confirm('Clear all fields and start fresh?')) return
    Object.assign(form, defaultCVData())
  }

  // ── Public API ─────────────────────────────────────────────────────────────

  return {
    // State
    form,
    previewScroll,
    previewContainer,
    pageCount,

    // Preview
    scalePreview,

    // Job
    addJob,
    removeJob,
    addBullet,
    removeBullet,

    // Education
    addEducation,
    removeEducation,

    // Skills
    addSkill,
    removeSkill,

    // Certifications
    addCertification,
    removeCertification,

    // Referees
    addReferee,
    removeReferee,

    // Exports
    printPDF,
    exportDocx,

    // Reset
    clearAll,
  }
}