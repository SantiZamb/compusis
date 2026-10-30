// Los datos del catálogo están en productos.js (CATEGORIES y PRODUCTS)
const WHATSAPP = "573108721135";

const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

const list = document.querySelector(".products");
const filters = document.querySelector(".filters");

function specRows(rows) {
  return rows.map(([k, v]) => `<div class="spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
}

function suggestions(p) {
  const items = (p.sugeridos || []).map((id) => byId[id]).filter(Boolean);
  if (!items.length) return "";
  return `
    <div class="suggested">
      <p>Se complementa con</p>
      <ul>${items.map((s) => `
        <li><a href="#p-${s.id}" data-goto="${s.id}">
          <img src="assets/productos/${s.img}.webp" alt="" loading="lazy" width="40" height="40">
          <span>${esc(s.name)}</span>
        </a></li>`).join("")}
      </ul>
    </div>`;
}

function fichaLink(p) {
  return p.ficha
    ? `<a class="ficha" href="assets/fichas/${encodeURIComponent(p.ficha)}" target="_blank" rel="noopener">Descargar ficha técnica (PDF)</a>`
    : `<a class="ficha" href="${waLink(`Hola Compusis, ¿me pueden enviar la ficha técnica de: ${p.name}?`)}" target="_blank" rel="noopener">Solicitar ficha técnica</a>`;
}

function render(cat) {
  const items = cat === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cats.includes(cat));
  list.innerHTML = items.map((p) => `
    <li class="product" id="p-${p.id}">
      <div class="product-img"><img src="assets/productos/${p.img}.webp" alt="${esc(p.name)}" loading="lazy" width="400" height="400"></div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p class="warranty">${p.warranty ? esc(p.warranty) : "Precio por volumen, consúltanos"}</p>
        ${p.desc ? `<p class="desc">${esc(p.desc)}</p>` : ""}
        <dl class="specs">${specRows(p.specs)}</dl>
        ${fichaLink(p)}
        ${suggestions(p)}
        <a class="btn btn-navy btn-sm" target="_blank" rel="noopener"
           href="${waLink(`Hola Compusis, quiero cotizar: ${p.name}`)}">Cotizar este equipo</a>
      </div>
    </li>`).join("");
}

filters.innerHTML = CATEGORIES.map((c, i) => {
  const n = c.id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cats.includes(c.id)).length;
  return `<button type="button" data-cat="${c.id}" aria-pressed="${i === 0}">${c.name} <span>${n}</span></button>`;
}).join("");

function setFilter(cat) {
  filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.cat === cat));
  render(cat);
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (btn) setFilter(btn.dataset.cat);
});

// Ir a un producto sugerido aunque el filtro actual lo oculte
list.addEventListener("click", (e) => {
  const link = e.target.closest("[data-goto]");
  if (!link) return;
  e.preventDefault();
  if (!document.getElementById(`p-${link.dataset.goto}`)) setFilter("todos");
  const target = document.getElementById(`p-${link.dataset.goto}`);
  target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  target.classList.remove("flash");
  void target.offsetWidth;
  target.classList.add("flash");
  target.querySelector("a, button")?.focus({ preventScroll: true });
});

render("todos");

// Menú móvil
const toggle = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", !open);
  menu.classList.toggle("open", !open);
});
menu.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("open");
  }
});

// Formulario de contacto -> WhatsApp
document.getElementById("quote").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const empresa = f.get("empresa").trim();
  const text = `Hola Compusis, soy ${f.get("nombre").trim()}${empresa ? ` de ${empresa}` : ""}.\nMe interesa: ${f.get("interes")}.\n${f.get("mensaje").trim()}`;
  window.open(waLink(text), "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
