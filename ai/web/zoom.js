/**
 * Full-screen zoom for images and diagrams.
 *
 * Opens on top of everything (the notes viewer stays open underneath). The picture is redrawn at the
 * zoomed size rather than stretched, so text stays sharp. Zoom with the wheel, the +/− buttons,
 * the +/−/0 keys or a double-click; drag (or scroll) to move around; Esc or a click on the backdrop closes.
 */
const MIN = 0.25;
const MAX = 8;
const STEP = 1.25;

const box = document.getElementById("lightbox");
const stage = document.getElementById("lightbox-stage");
const content = document.getElementById("lightbox-content");
const level = document.getElementById("lightbox-level");

let natural = { width: 1, height: 1 };
let scale = 1;
let fit = 1;
let drag = null;

export function isZoomOpen() {
  return !box.hidden;
}

/** Natural drawing size of an <img> or an inline <svg>. */
function sizeOf(element) {
  if (element instanceof HTMLImageElement) return { width: element.naturalWidth || 800, height: element.naturalHeight || 600 };
  const view = element.viewBox?.baseVal;
  if (view?.width && view?.height) return { width: view.width, height: view.height };
  const rect = element.getBoundingClientRect();
  return { width: rect.width || 800, height: rect.height || 600 };
}

function apply(next, anchor) {
  const before = scale;
  scale = Math.min(MAX, Math.max(MIN, next));
  // Keep the point under the cursor (or the centre) in place while zooming.
  const point = anchor ?? { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
  const contentX = (stage.scrollLeft + point.x - content.offsetLeft) / before;
  const contentY = (stage.scrollTop + point.y - content.offsetTop) / before;
  content.style.width = `${natural.width * scale}px`;
  content.style.height = `${natural.height * scale}px`;
  stage.scrollLeft = contentX * scale + content.offsetLeft - point.x;
  stage.scrollTop = contentY * scale + content.offsetTop - point.y;
  level.textContent = `${Math.round(scale * 100)}%`;
  stage.classList.toggle("can-pan", content.offsetWidth > stage.clientWidth || content.offsetHeight > stage.clientHeight);
}

function fitToScreen() {
  // Fit the screen, but never blow a small picture up past 2× on open.
  fit = Math.min((stage.clientWidth - 48) / natural.width, (stage.clientHeight - 48) / natural.height, 2);
  apply(fit);
  stage.scrollTo(0, 0);
}

/** Open an <img> or a diagram (any element holding an <svg>). */
export function openZoom(source) {
  const svg = source instanceof HTMLImageElement ? null : source.querySelector("svg");
  let shown;
  if (svg) {
    shown = svg.cloneNode(true);
    shown.removeAttribute("style");
    shown.setAttribute("width", "100%");
    shown.setAttribute("height", "100%");
    shown.setAttribute("preserveAspectRatio", "xMidYMid meet");
    natural = sizeOf(svg);
  } else {
    shown = new Image();
    shown.src = source.currentSrc || source.src;
    shown.alt = source.alt;
    shown.decoding = "async";
    natural = sizeOf(source);
  }
  shown.draggable = false;
  content.replaceChildren(shown);
  content.classList.toggle("is-diagram", !!svg);
  box.hidden = false;
  document.body.classList.add("has-zoom");
  scale = 1;
  fitToScreen();
  // Images not loaded yet (lazy) learn their real size once they arrive.
  if (shown instanceof HTMLImageElement && !shown.complete) {
    shown.addEventListener("load", () => {
      natural = sizeOf(shown);
      fitToScreen();
    }, { once: true });
  }
  box.querySelector("[data-zoom='in']")?.focus({ preventScroll: true });
}

export function closeZoom() {
  box.hidden = true;
  content.replaceChildren();
  document.body.classList.remove("has-zoom");
}

box.addEventListener("click", event => {
  const button = event.target.closest("[data-zoom]");
  if (button) {
    event.stopPropagation();
    const kind = button.dataset.zoom;
    if (kind === "in") apply(scale * STEP);
    if (kind === "out") apply(scale / STEP);
    if (kind === "fit") fitToScreen();
    if (kind === "actual") apply(1);
    if (kind === "close") closeZoom();
    return;
  }
  // A click on the empty backdrop (not after a drag) closes.
  if ((event.target === stage || event.target === box) && !drag?.moved) closeZoom();
});

stage.addEventListener("wheel", event => {
  event.preventDefault();
  const rect = stage.getBoundingClientRect();
  const factor = Math.exp(-event.deltaY * (event.deltaMode === 1 ? 0.05 : 0.0015));
  apply(scale * factor, { x: event.clientX - rect.left, y: event.clientY - rect.top });
}, { passive: false });

stage.addEventListener("dblclick", event => {
  const rect = stage.getBoundingClientRect();
  const anchor = { x: event.clientX - rect.left, y: event.clientY - rect.top };
  apply(scale < fit * 1.9 ? fit * 2.5 : fit, anchor);
});

stage.addEventListener("pointerdown", event => {
  if (event.button !== 0 || event.target.closest("[data-zoom]")) return;
  drag = { x: event.clientX, y: event.clientY, left: stage.scrollLeft, top: stage.scrollTop, moved: false, id: event.pointerId };
  stage.classList.add("dragging");
});

stage.addEventListener("pointermove", event => {
  if (!drag || drag.id !== event.pointerId) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (Math.abs(dx) + Math.abs(dy) > 4 && !drag.moved) {
    drag.moved = true;
    stage.setPointerCapture(event.pointerId);
  }
  stage.scrollLeft = drag.left - dx;
  stage.scrollTop = drag.top - dy;
});

function endDrag() {
  stage.classList.remove("dragging");
  // Let the click handler see `moved` first, then clear it.
  setTimeout(() => (drag = null), 0);
}
stage.addEventListener("pointerup", endDrag);
stage.addEventListener("pointercancel", endDrag);

document.addEventListener("keydown", event => {
  if (!isZoomOpen()) return;
  const keys = { "+": () => apply(scale * STEP), "=": () => apply(scale * STEP), "-": () => apply(scale / STEP), "0": fitToScreen, "1": () => apply(1) };
  if (event.key === "Escape") {
    event.stopImmediatePropagation();
    event.preventDefault();
    return closeZoom();
  }
  const action = keys[event.key];
  if (action) {
    event.preventDefault();
    action();
  }
}, true);

window.addEventListener("resize", () => {
  if (isZoomOpen() && Math.abs(scale - fit) < 0.001) fitToScreen();
});
