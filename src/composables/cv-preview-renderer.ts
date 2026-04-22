import type { CVData } from "./types";
import { buildCVHTML } from "./cv-html-builder";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Max content height in px for a single A4 page at 96dpi */
// const PAGE_CONTENT_HEIGHT_PX = 987
const PAGE_CONTENT_HEIGHT_PX = 950;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns (or lazily creates) a hidden off-screen measurer div
 * used to calculate element heights before pagination.
 */
function getMeasurer(): HTMLElement {
  const existing = document.getElementById("cv-measurer");
  if (existing) return existing;

  const el = document.createElement("div");
  el.id = "cv-measurer";
  el.className = "cv-page";
  el.style.cssText = [
    "position: fixed",
    "left: -9999px",
    "top: 0",
    "visibility: hidden",
    "max-height: none !important",
    "min-height: unset !important",
    "height: auto !important",
    "overflow: visible !important",
  ].join("; ");
  document.body.appendChild(el);
  return el;
}

/**
 * Splits an array of DOM elements into pages based on a max height.
 */
// function paginate(nodes: Element[]): Element[][] {
//   const pages: Element[][] = []
//   let currentPage: Element[] = []
//   let currentHeight = 0

//   for (const node of nodes) {
//     // +4px accounts for rounding / sub-pixel gaps
//     const nodeHeight = node.getBoundingClientRect().height + 4

//     if (currentHeight + nodeHeight > PAGE_CONTENT_HEIGHT_PX && currentPage.length > 0) {
//       pages.push(currentPage)
//       currentPage = [node.cloneNode(true) as Element]
//       currentHeight = nodeHeight
//     } else {
//       currentPage.push(node.cloneNode(true) as Element)
//       currentHeight += nodeHeight
//     }
//   }

//   if (currentPage.length > 0) pages.push(currentPage)

//   return pages
// }

// Replace your paginate function entirely:
function paginate(nodes: Element[]): Element[][] {
  const pages: Element[][] = [];
  let currentPage: Element[] = [];
  let currentHeight = 0;

  const measurer = getMeasurer();

  for (const node of nodes) {
    // Measure inside a temp wrapper matching page width
    const probe = document.createElement("div");
    probe.appendChild(node.cloneNode(true));
    measurer.appendChild(probe);
    const nodeHeight = probe.getBoundingClientRect().height + 4;
    measurer.removeChild(probe);

    if (
      currentHeight + nodeHeight > PAGE_CONTENT_HEIGHT_PX &&
      currentPage.length > 0
    ) {
      pages.push(currentPage);
      currentPage = [node.cloneNode(true) as Element];
      currentHeight = nodeHeight;
    } else {
      currentPage.push(node.cloneNode(true) as Element);
      currentHeight += nodeHeight;
    }
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

/**
 * Builds a single page <div class="cv-page"> element from a list of nodes.
 */
function buildPageElement(
  nodes: Element[],
  isFirstPage: boolean,
): HTMLDivElement {
  const page = document.createElement("div");
  page.className = "cv-page";

  if (!isFirstPage) {
    page.style.minHeight = "auto";
    page.style.overflow = "visible";
  }

  for (const node of nodes) page.appendChild(node);
  return page;
}

/**
 * Builds a page label element, e.g. "Page 1 of 3".
 */
function buildPageLabel(index: number, total: number): HTMLDivElement {
  const label = document.createElement("div");
  label.className = "cv-page-label";
  label.style.cssText = [
    "font-size: 10px",
    "color: var(--text-muted)",
    "letter-spacing: 0.1em",
    "text-transform: uppercase",
    "align-self: flex-start",
    "margin-bottom: -8px",
  ].join("; ");
  label.textContent = `Page ${index + 1} of ${total}`;
  return label;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Renders paginated CV HTML into the given container element.
 * Returns the number of pages rendered (0 if only 1 page — no label needed).
 */
export function renderCVPreview(data: CVData, container: HTMLElement): number {
  // 1. Measure all nodes in the hidden off-screen div
  const measurer = getMeasurer();
  measurer.innerHTML = buildCVHTML(data);
  const nodes = Array.from(measurer.children);

  // 2. Paginate nodes
  const pages = paginate(nodes);

  // 3. Render pages into the container
  measurer.innerHTML = "";
  container.innerHTML = "";
  const isMultiPage = pages.length > 1;

  pages.forEach((pageNodes, index) => {
    if (isMultiPage) {
      container.appendChild(buildPageLabel(index, pages.length));
    }
    container.appendChild(buildPageElement(pageNodes, index === 0));
  });

  return isMultiPage ? pages.length : 0;
}

/**
 * Scales the preview container to fit within the scroll area.
 * Should be called after render and on window resize.
 */
export function scaleCVPreview(
  scroll: HTMLElement,
  container: HTMLElement,
): void {
  const firstPage = container.querySelector<HTMLElement>(".cv-page");
  const pageWidth = firstPage?.offsetWidth ?? 794;

  const scale = Math.min(1, (scroll.clientWidth - 48) / pageWidth);

  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = "top center";

  const scaledHeight = container.scrollHeight * scale;
  const scaledWidth = pageWidth * scale;
  const offsetX = (scaledWidth - pageWidth) / 2;

  container.style.marginLeft = `${offsetX}px`;
  container.style.marginRight = `${offsetX}px`;
  container.style.marginBottom = `${scaledHeight - container.scrollHeight}px`;
}
