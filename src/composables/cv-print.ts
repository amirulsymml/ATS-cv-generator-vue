import { cvPrintStyles, cvScreenStyles } from './cv-print-styles'

function clonePage(page: Element): string {
  const clone = page.cloneNode(true) as HTMLElement

  // Remove page labels
  clone.querySelectorAll('.cv-page-label').forEach((l) => l.remove())

  // Strip Vue scoped attributes
  const allEls = [clone, ...Array.from(clone.querySelectorAll('*'))]
  allEls.forEach((el) => {
    Array.from(el.attributes)
      .filter((attr) => attr.name.startsWith('data-v-'))
      .forEach((attr) => el.removeAttribute(attr.name))
  })

  return `<div class="cv-page">${clone.innerHTML}</div>`
}

function buildPrintHTML(pagesHTML: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>${cvPrintStyles}</style>
        <style>${cvScreenStyles}</style>
      </head>
      <body>
        ${pagesHTML}
      </body>
    </html>
  `
}

function triggerPrint(printWindow: Window): void {
  printWindow.onload = () => {
    printWindow.focus()
    printWindow.print()
  }

  // Fallback in case onload already fired
  setTimeout(() => {
    if (printWindow && !printWindow.closed) {
      printWindow.focus()
      printWindow.print()
    }
  }, 800)
}

export function openPrintWindow(container: HTMLElement, fileName: string): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    alert('Print window could not be opened. Please check your pop-up settings.')
    return
  }

  const pages = Array.from(container.querySelectorAll('.cv-page'))
  const pagesHTML = pages.map(clonePage).join('\n')
  const title = `${fileName.replace(/\s+/g, '_')}_CV`

  printWindow.document.write(buildPrintHTML(pagesHTML, title))
  printWindow.document.close()

  triggerPrint(printWindow)
}