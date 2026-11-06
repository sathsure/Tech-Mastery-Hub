// Applies the saved (or system) colour theme before the page draws, so there is no flash.
(function () {
  var saved = null;
  try { saved = localStorage.getItem("tmh.theme"); } catch (e) {}
  var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
})();
