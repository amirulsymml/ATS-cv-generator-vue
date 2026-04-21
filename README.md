# ATS CV Generator

A modern, professional CV (Curriculum Vitae) generator built with Vue 3, TypeScript, and Vite. Designed to create ATS-optimized (Applicant Tracking System) CVs with live preview and multiple export formats.

## Features

✨ **Live Preview** - Real-time CV preview as you type
📄 **PDF Export** - Download your CV as a professional PDF
📝 **DOCX Export** - Export to Microsoft Word format
⚡ **Fast & Responsive** - Built with Vite for instant HMR and optimal performance
🎨 **Professional Styling** - Clean, modern UI with ATS-friendly design
📱 **Responsive Layout** - Works on various screen sizes

## Project Structure

```
src/
├── components/
│   ├── Sidebar.vue         # CV form inputs
│   └── PreviewPanel.vue    # Live CV preview
├── composables/
│   └── useCVForm.ts        # CV state management & export logic
├── styles/
│   ├── main.css            # Global styles
│   ├── variables.css       # CSS custom properties
│   ├── sidebar.css         # Sidebar component styles
│   ├── preview.css         # Preview panel styles
│   └── cv-page.css         # CV page styling
├── App.vue                 # Main application component
└── main.ts                 # Application entry point
```

## Key Technologies

- **Vue 3** - Modern reactive UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool and dev server
- **html2pdf.js** - PDF generation from HTML
- **docx** - DOCX file creation library

## Getting Started

### Development

```bash
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

Production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Architecture

### Composables
The `useCVForm` composable encapsulates all CV-related logic:
- Form state management using Vue's `reactive`
- CV HTML generation from form data
- PDF and DOCX export functionality
- Preview rendering and scaling

### Components
- **Sidebar.vue**: Form inputs for CV content (personal info, jobs, education, skills, etc.)
- **PreviewPanel.vue**: Displays the live CV preview with automatic pagination

### Styling
- CSS custom properties for theming
- Organized by component with scope
- Separate CV page styles for print-friendly output

## Supported Sections

- **Personal Information** - Name, contact details, location, LinkedIn
- **Professional Summary** - Brief overview (2-3 sentences)
- **Work Experience** - Jobs with company, location, dates, and bullet points
- **Education** - Degrees, institutions, locations, years
- **Technical Skills** - Categorized skill groups
- **Certifications & Training** - Professional certifications
- **Referees** - Reference contacts (up to 4)

## Export Formats

- **PDF** - Professional PDF with proper formatting
- **DOCX** - Microsoft Word format for further editing
- **HTML** - Live preview in browser

## Browser Support

Works in all modern browsers that support:
- Vue 3 (ES2020+)
- CSS Grid and Flexbox
- ES Modules

## Dependencies

- `vue@^3.5.32` - Core Vue framework
- `docx@^9.6.1` - DOCX generation
- `html2pdf.js@^0.14.0` - PDF generation
- `@vitejs/plugin-vue@^6.0.6` - Vue support for Vite
- `typescript~6.0.2` - TypeScript compiler

## License

MIT
