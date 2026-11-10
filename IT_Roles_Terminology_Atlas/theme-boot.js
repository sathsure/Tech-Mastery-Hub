/*
 * Loaded in <head>, before the page is drawn: sets the light / dark theme (and the "inside the tutor" flag)
 * so the first frame already has the right colours and layout. Without it the page could flash light
 * for a moment before the main script runs.
 */
(() => {
  const root = document.documentElement;
  const embedded = new URLSearchParams(location.search).has("embed") && window.parent !== window;
  let theme = null;
  if (embedded) {
    root.classList.add("embedded");
    try { theme = window.parent.document.documentElement.getAttribute("data-theme"); } catch { /* not same-origin */ }
  }
  try { theme = theme || localStorage.getItem("atlas-theme"); } catch { /* storage blocked */ }
  if (theme !== "dark" && theme !== "light") theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  root.dataset.theme = theme;
})();
