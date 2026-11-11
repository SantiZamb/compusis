// Interacciones del sitio. El contenido se genera con build.js a partir de los archivos de datos.

// Enlaces antiguos de la versión de una sola página (index.html#seccion)
if (document.body.dataset.page === "inicio" && location.hash) {
  const old = {
    "#educacion": "educacion/", "#cursos": "educacion/cursos/", "#tecnicos": "educacion/tecnicos/",
    "#portafolio": "tecnologia/productos/", "#industrias": "tecnologia/#industrias",
    "#guias": "tecnologia/#recursos", "#contacto": "contacto/",
  }[location.hash];
  if (old) location.replace(old);
}

// Menú principal
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
const subToggles = document.querySelectorAll(".sub-toggle");

function closeSubs(except) {
  subToggles.forEach((b) => {
    if (b !== except) {
      b.setAttribute("aria-expanded", "false");
      b.parentElement.classList.remove("open");
    }
  });
}

toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", open);
  menu.classList.toggle("open", open);
  if (!open) closeSubs();
});

subToggles.forEach((b) => {
  b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    closeSubs(b);
    b.setAttribute("aria-expanded", open);
    b.parentElement.classList.toggle("open", open);
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".has-sub")) closeSubs();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  const openSub = document.querySelector(".has-sub.open .sub-toggle");
  if (openSub) {
    closeSubs();
    openSub.focus();
  } else if (menu.classList.contains("open")) {
    toggle.click();
    toggle.focus();
  }
});

// Filtros y buscador de listados
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

document.querySelectorAll("[data-listing]").forEach((listing) => {
  const toolbar = listing.querySelector("[data-toolbar]");
  const items = [...listing.querySelectorAll("[data-items] > li")];
  const count = listing.querySelector("[data-count]");
  const empty = listing.querySelector("[data-empty]");
  const search = listing.querySelector("[data-search]");
  const groups = [...listing.querySelectorAll("[data-filter]")];
  toolbar.hidden = false;

  function apply() {
    const query = search ? fold(search.value.trim()) : "";
    const active = groups.map((g) => [g.dataset.filter, g.querySelector('[aria-pressed="true"]').dataset.value]);
    let shown = 0;
    items.forEach((li) => {
      const ok = active.every(([key, value]) => !value || (li.dataset[key] || "").split(" ").includes(value))
        && (!query || query.split(/\s+/).every((w) => (li.dataset.search || fold(li.textContent)).includes(w)));
      li.hidden = !ok;
      if (ok) shown++;
    });
    count.textContent = shown === items.length ? "" : `${shown} de ${items.length} resultados`;
    empty.hidden = shown > 0;
  }

  groups.forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    g.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    apply();
  }));
  if (search) search.addEventListener("input", apply);
});

// Formulario de contacto -> WhatsApp
const form = document.getElementById("quote");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const empresa = f.get("empresa").trim();
    const text = `Hola Compusis, soy ${f.get("nombre").trim()}${empresa ? ` de ${empresa}` : ""}.\nMe interesa: ${f.get("interes")}.\n${f.get("mensaje").trim()}`;
    window.open(`https://wa.me/${form.dataset.wa}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });
}
