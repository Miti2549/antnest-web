(function () {
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-th]").forEach((node) => {
      const value = node.getAttribute(lang === "en" ? "data-en" : "data-th");
      if (value) node.textContent = value;
    });
    document.querySelectorAll("[data-th-html]").forEach((node) => {
      const value = node.getAttribute(lang === "en" ? "data-en-html" : "data-th-html");
      if (value) node.innerHTML = value;
    });
    document.querySelectorAll(".lang-switch button").forEach((button) => {
      button.classList.toggle("active", button.dataset.lang === lang);
    });
    localStorage.setItem("antsLang", lang);
    syncFeatureDetail();
  }

  function syncFeatureDetail(row) {
    const activeRow = row || document.querySelector(".feature-row.active") || document.querySelector(".feature-row[data-feature-title-th]");
    if (!activeRow) return;

    const lang = document.documentElement.lang === "en" ? "en" : "th";
    const title = activeRow.getAttribute(lang === "en" ? "data-feature-title-en" : "data-feature-title-th");
    const body = activeRow.getAttribute(lang === "en" ? "data-feature-body-en" : "data-feature-body-th");
    const titleNode = document.querySelector("[data-feature-detail-title]");
    const bodyNode = document.querySelector("[data-feature-detail-body]");

    document.querySelectorAll(".feature-row[data-feature-title-th]").forEach((button) => {
      const isActive = button === activeRow;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (titleNode && title) titleNode.textContent = title;
    if (bodyNode && body) bodyNode.textContent = body;
  }

  document.querySelectorAll(".lang-switch button").forEach((button) => {
    button.addEventListener("click", () => applyLang(button.dataset.lang));
  });

  document.querySelectorAll(".feature-row[data-feature-title-th]").forEach((button) => {
    button.addEventListener("click", () => syncFeatureDetail(button));
  });

  const requested = new URLSearchParams(window.location.search).get("lang");
  applyLang(requested === "en" || requested === "th" ? requested : (localStorage.getItem("antsLang") || "th"));
})();
