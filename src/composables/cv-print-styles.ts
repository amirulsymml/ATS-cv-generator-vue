export const cvPrintStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 210mm;
    background: white;
  }

  @page {
    size: A4;
    margin: 0;
  }

  /* ── Page container ── */
  .cv-page {
    background: #fff;
    width: 210mm;
    min-height: 297mm;
    height: auto;
    padding: 68px 76px;
    font-family: 'Calibri', 'DM Sans', sans-serif;
    color: #1a1a1a;
    line-height: 1.5;
    overflow: visible;
    display: block;
    page-break-after: always;
    break-after: page;
    page-break-inside: avoid;
    break-inside: avoid;
    text-align: justify;
  }

  .cv-page:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* ── Name & contact ── */
  .cv-name {
    text-align: center;
    font-size: 22pt;
    font-weight: 700;
    color: #111;
    margin-bottom: 5pt;
    line-height: 1.15;
    letter-spacing: 0.01em;
  }

  .cv-contact {
    text-align: center;
    font-size: 11pt;
    color: #333;
    margin-bottom: 12pt;
    line-height: 1.65;
  }

  .cv-contact span {
    margin: 0 5px;
    color: #bbb;
  }

  /* ── Section title ── */
  .cv-sec-title {
    font-size: 9pt;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    color: #111;
    border-bottom: 1.5px solid #111;
    padding-bottom: 2pt;
    margin-top: 10pt;
    margin-bottom: 5pt;
  }

  /* ── Summary ── */
  .cv-summary {
    font-size: 12pt;
    color: #1a1a1a;
    line-height: 1.55;
  }

  /* ── Work experience ── */
  .cv-job {
    margin-bottom: 8pt;
    break-inside: avoid;
  }

  .cv-job-hdr {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1pt;
  }

  .cv-job-title {
    font-weight: 600;
    font-size: 12pt;
    color: #111;
  }

  .cv-job-date {
    font-size: 10pt;
    color: #555;
    white-space: nowrap;
    margin-left: 8pt;
  }

  .cv-job-co {
    font-size: 11pt;
    color: #444;
    font-style: italic;
    margin-bottom: 3pt;
  }

  .cv-job ul {
    padding-left: 15pt;
    list-style: disc;
    margin-top: 2pt;
  }

  .cv-job ul li {
    font-size: 11pt;
    color: #1a1a1a;
    margin-bottom: 2pt;
    line-height: 1.45;
  }

  /* ── Education ── */
  .cv-edu {
    margin-bottom: 6pt;
    break-inside: avoid;
  }

  .cv-edu-hdr {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 1pt;
  }

  .cv-edu-deg {
    font-weight: 600;
    font-size: 12pt;
    color: #111;
  }

  .cv-edu-yr {
    font-size: 10pt;
    color: #555;
    white-space: nowrap;
    margin-left: 8pt;
  }

  .cv-edu-sch {
    font-size: 11pt;
    color: #444;
    font-style: italic;
  }

  /* ── Skills ── */
  .cv-skill-row {
    display: flex;
    gap: 0;
    margin-bottom: 2pt;
    font-size: 11pt;
    break-inside: avoid;
  }

  .cv-skill-lbl {
    font-weight: 600;
    color: #111;
    min-width: 150pt;
    flex-shrink: 0;
  }

  .cv-skill-val {
    color: #1a1a1a;
  }

  /* ── Certifications ── */
  .cv-cert {
    break-inside: avoid;
  }

  .cv-cert ul {
    padding-left: 15pt;
    list-style: disc;
  }

  .cv-cert ul li {
    font-size: 11pt;
    color: #1a1a1a;
    margin-bottom: 2pt;
    line-height: 1.45;
  }

  /* ── Referees ── */
  .cv-ref-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5pt 20pt;
  }

  .cv-ref-item {
    break-inside: avoid;
  }

  .cv-ref-name {
    font-weight: 600;
    font-size: 12pt;
    color: #111;
  }

  .cv-ref-phone {
    font-size: 11pt;
    color: #444;
  }

  .cv-ref-role {
    font-size: 10pt;
    color: #555;
    font-style: italic;
    line-height: 1.4;
  }
`

export const cvScreenStyles = `
  @media screen {
    html {
      background: #e0e0e0;
      min-height: 100vh;
    }

    body {
      background: #e0e0e0;
      padding: 40px 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    .cv-page {
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
      border: 1px solid #ccc;
      border-radius: 2px;
      flex-shrink: 0;
    }
  }
`