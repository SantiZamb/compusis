// Catálogo de productos (fuente: Portafolio de Tecnología Compusis)
const WHATSAPP = "573108721135";

const CATEGORIES = [
  { id: "todos", name: "Todos" },
  { id: "pos", name: "Punto de venta" },
  { id: "lectores", name: "Lectores" },
  { id: "recibos", name: "Impresoras de recibos" },
  { id: "etiquetas", name: "Impresoras de etiquetas" },
  { id: "carnets", name: "Carnetización" },
  { id: "suministros", name: "Suministros" },
];

const PRODUCTS = [
  {
    name: "Cajón monedero SAT 119X negro",
    img: "cajon-sat-119x", cats: ["pos"], warranty: "1 año de garantía",
    specs: [
      ["Medidas", "410 × 420 × 100 mm"],
      ["Monedas", "8 compartimentos"],
      ["Billetes", "5 compartimentos"],
      ["Conexión", "RJ11"],
      ["Apertura", "Automática o con llave"],
    ],
  },
  {
    name: "Lector de código de barras SAT LD101R+1",
    img: "lector-sat-ld101r", cats: ["lectores", "pos"], warranty: "1 año de garantía",
    specs: [
      ["Tecnología", "Láser lineal"],
      ["Velocidad", "300 lecturas/s"],
      ["Modo", "Manual o continuo"],
      ["Códigos", "1D"],
    ],
  },
  {
    name: "Lector de código de barras Zebra DS2208",
    img: "lector-ds2208", cats: ["lectores", "pos"], warranty: "1 año de garantía",
    specs: [
      ["Tecnología", "Imager"],
      ["Rango (UPC 13 mil)", "1,23 a 36,8 cm"],
      ["Velocidad de movimiento", "76,2 cm/s"],
      ["Códigos", "1D y 2D"],
    ],
  },
  {
    name: "Impresora térmica SAT Q38T USEBW",
    img: "impresora-q38t", cats: ["recibos", "pos"], warranty: "1 año de garantía",
    specs: [
      ["Resolución", "203 dpi"],
      ["Velocidad", "300 mm/s"],
      ["Ancho de papel", "58 a 80 mm"],
      ["Diámetro de rollo", "82 mm"],
      ["Compatibilidad", "Windows, macOS, Linux, Android, OPOS"],
      ["Códigos", "1D y 2D"],
    ],
  },
  {
    name: "Impresora térmica SAT Q23T",
    img: "impresora-q23t", cats: ["recibos", "pos"], warranty: "1 año de garantía",
    specs: [
      ["Resolución", "203 dpi"],
      ["Velocidad", "230 mm/s"],
      ["Ancho de papel", "80 mm"],
      ["Memoria", "64 / 256 KB"],
      ["Compatibilidad", "Windows, macOS, Linux, Android, OPOS"],
      ["Códigos", "1D y 2D"],
    ],
  },
  {
    name: "Impresora de etiquetas y recibos SAT DTL58 UE",
    img: "impresora-dtl58", cats: ["etiquetas", "recibos"], warranty: "1 año de garantía",
    specs: [
      ["Resolución", "203 dpi"],
      ["Velocidad", "100 mm/s o 76 mm/s"],
      ["Rollo", "70 mm u 80 mm"],
      ["Core", "25,4 a 40 mm"],
      ["Ancho", "48 mm"],
      ["Compatibilidad", "Windows 7/8/10/11, Windows Server, Linux, macOS"],
      ["Códigos", "1D y 2D"],
    ],
  },
  {
    name: "Impresora de etiquetas SAT TT448-2",
    img: "impresora-tt448", cats: ["etiquetas"], warranty: "1 año de garantía",
    specs: [
      ["Resolución", "203 dpi"],
      ["Ancho de impresión", "104 mm"],
      ["Ribbon", "300 m, core de 1 pulgada"],
      ["Lenguajes", "ZPL, TSPL, EPL"],
      ["Software", "BarTender"],
      ["Compatibilidad", "Windows, Linux, Mac"],
    ],
  },
  {
    name: "Impresora de etiquetas industrial SAT XT46",
    img: "impresora-xt46", cats: ["etiquetas"], warranty: "2 años de garantía",
    specs: [
      ["Resolución", "203 dpi"],
      ["Ancho de impresión", "104 mm"],
      ["Ribbon", "450 m"],
      ["Core", "25 a 76 mm"],
      ["Lenguajes", "DPL, ZPL-II, TSPL"],
      ["Software", "BarTender UltraLite, SAT Label Designer"],
      ["Compatibilidad", "Windows, Linux, macOS"],
    ],
  },
  {
    name: "Impresoras de carnets Zebra ZC100 / ZC300",
    img: "impresora-carnets-zc", cats: ["carnets"], warranty: "3 años de garantía",
    specs: [
      ["Resolución", "300 dpi"],
      ["Incluye", "Impresora, 200 carnets PVC, cinta de 200 imágenes y software CardStudio Standard"],
      ["Compatibilidad", "Windows, Linux, Apple"],
    ],
  },
  {
    name: "Rollo térmico SAT 80 mm × 60 m, 48\u00a0g",
    img: "rollo-termico-80x60", cats: ["suministros"], warranty: null,
    specs: [
      ["Medidas", "80 mm × 60 m"],
      ["Gramaje", "48 g/m²"],
      ["Uso", "Impresoras POS de alta demanda"],
      ["Compatibilidad", "Impresoras POS de diversas marcas"],
    ],
  },
];

const waLink = (text) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const list = document.querySelector(".products");
const filters = document.querySelector(".filters");
const SHOWN = 3;

function specRows(rows) {
  return rows.map(([k, v]) => `<div class="spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
}

function render(cat) {
  const items = cat === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.cats.includes(cat));
  list.innerHTML = items.map((p) => {
    const more = p.specs.slice(SHOWN);
    return `
    <li class="product">
      <div class="product-img"><img src="assets/productos/${p.img}.webp" alt="${esc(p.name)}" loading="lazy" width="400" height="400"></div>
      <div class="product-body">
        <h3>${esc(p.name)}</h3>
        <p class="warranty">${p.warranty ? esc(p.warranty) : "Precio por volumen, consúltenos"}</p>
        <dl class="specs">${specRows(p.specs.slice(0, SHOWN))}</dl>
        ${more.length ? `<details><summary>Ver ficha completa</summary><dl class="specs">${specRows(more)}</dl></details>` : ""}
        <a class="btn btn-navy btn-sm" target="_blank" rel="noopener"
           href="${waLink(`Hola Compusis, quiero cotizar: ${p.name}`)}">Cotizar este equipo</a>
      </div>
    </li>`;
  }).join("");
}

filters.innerHTML = CATEGORIES.map((c, i) => {
  const n = c.id === "todos" ? PRODUCTS.length : PRODUCTS.filter((p) => p.cats.includes(c.id)).length;
  return `<button type="button" data-cat="${c.id}" aria-pressed="${i === 0}">${c.name} <span>${n}</span></button>`;
}).join("");

filters.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  filters.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
  render(btn.dataset.cat);
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

// Formulario de cotización -> WhatsApp
document.getElementById("quote").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const empresa = f.get("empresa").trim();
  const text = `Hola Compusis, soy ${f.get("nombre").trim()}${empresa ? ` de ${empresa}` : ""}.\n${f.get("mensaje").trim()}`;
  window.open(waLink(text), "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
