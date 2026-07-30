"use strict";

(() => {
  const one = (selector, root = document) => root.querySelector(selector);
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];

  all("aside nav button").forEach((button) => {
    button.addEventListener("click", () => {
      all("aside nav button").forEach((item) => item.classList.remove("active"));
      all(".panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      one(`#panel-${button.dataset.panel}`)?.classList.add("active");
    });
  });

  all("[data-width]").forEach((button) => {
    button.addEventListener("click", () => {
      all("[data-width]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const frame = one("#previewFrame");
      if (frame) frame.style.width = `${button.dataset.width}px`;
    });
  });
})();
