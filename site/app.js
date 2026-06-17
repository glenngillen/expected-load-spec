// Expected Load — site interactions. Vanilla JS, no dependencies.

(function () {
  "use strict";

  // Language example tabs.
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var buttons = group.querySelectorAll(".tab-strip [role='tab']");
    var panels = group.querySelectorAll(".tab-panel");

    function select(name) {
      buttons.forEach(function (b) {
        b.setAttribute("aria-selected", String(b.dataset.tab === name));
      });
      panels.forEach(function (p) {
        if (p.dataset.panel === name) {
          p.removeAttribute("hidden");
        } else {
          p.setAttribute("hidden", "");
        }
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        select(b.dataset.tab);
      });
      // Left/right arrow keys move between tabs.
      b.addEventListener("keydown", function (e) {
        var list = Array.prototype.slice.call(buttons);
        var i = list.indexOf(b);
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          var next = e.key === "ArrowRight" ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
          list[next].focus();
          select(list[next].dataset.tab);
        }
      });
    });
  });
})();
