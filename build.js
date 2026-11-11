// Genera el sitio estático en _site/ a partir de los archivos de datos:
//   productos.js, cursos.js, tecnicos.js y sitio.js
// Uso: node build.js
// Cada ruta (educacion/cursos/<slug>/, tecnologia/productos/<id>/, ...) se escribe como una
// carpeta con su index.html, así los enlaces directos funcionan en GitHub Pages.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = __dirname;
const OUT = path.join(ROOT, "_site");

function load(file, names) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${fs.readFileSync(path.join(ROOT, file), "utf8")}\n;globalThis.__data = { ${names.join(", ")} };`, ctx, { filename: file });
  return ctx.__data;
}

const { CATEGORIES, PRODUCTS } = load("productos.js", ["CATEGORIES", "PRODUCTS"]);
const { CURSOS } = load("cursos.js", ["CURSOS"]);
const { TECNICOS } = load("tecnicos.js", ["TECNICOS"]);
const { SITIO, SEDES, TECH_GROUPS, INDUSTRIAS, GUIAS, MARCAS } = load("sitio.js", ["SITIO", "SEDES", "TECH_GROUPS", "INDUSTRIAS", "GUIAS", "MARCAS"]);

// ---------- Utilidades ----------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const wa = (text) => `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(text)}`;
const fold = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const slugify = (s) => fold(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const sedeById = Object.fromEntries(SEDES.map((s) => [s.id, s]));
const productById = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const year = new Date().getFullYear();

const groupProducts = (g) => PRODUCTS.filter((p) => p.cats.some((c) => g.cats.includes(c)));
const GROUPS = TECH_GROUPS.filter((g) => groupProducts(g).length > 0);
const groupsOf = (p) => GROUPS.filter((g) => p.cats.some((c) => g.cats.includes(c)));
const mainGroup = (p) => GROUPS.find((g) => g.cats.includes(p.cats[0])) || groupsOf(p)[0];
const AREAS = [...new Set(CURSOS.map((c) => c.area))];
const SEDES_TEC = SEDES.filter((s) => TECNICOS.some((t) => t.sede === s.id));

for (const list of [["cursos.js", CURSOS], ["tecnicos.js", TECNICOS], ["productos.js", PRODUCTS]]) {
  const ids = list[1].map((x) => x.slug || x.id);
  const dup = ids.find((id, i) => ids.indexOf(id) !== i);
  if (dup) throw new Error(`${list[0]}: identificador repetido "${dup}"`);
}

const ETDH = "COMPUSIS DE COLOMBIA es una Institución de Educación para el Trabajo y el Desarrollo Humano (ETDH). Los programas ofertados conducen a la obtención de un Certificado de Aptitud Ocupacional como Técnico Laboral por Competencias. No otorgan título profesional universitario.";

const ICON = {
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 9v6"/>',
  book: '<path d="M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 14.5c3 0 6 1.8 6 5.5"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>',
  chart: '<path d="M4 20V14M9 20V10M14 20V12M19 20V6"/><path d="M4 10l5-4 5 3 6-5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>',
  chevron: '<path d="M6 9l6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
};
const icon = (name, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[name]}</svg>`;

// ---------- Páginas ----------
const pages = [];
const page = (p) => pages.push(p);

function urlHelper(route) {
  const depth = route.split("/").filter(Boolean).length;
  const prefix = "../".repeat(depth);
  return (to = "") => (prefix + to) || "./";
}

// ---------- Componentes ----------
function header(p, u) {
  const cur = (route) => (p.route === route ? ' aria-current="page"' : "");
  const active = (sec) => (p.section === sec ? ' class="is-active"' : "");
  const sub = (id, label, items) => `
          <button type="button" class="sub-toggle" aria-expanded="false" aria-controls="${id}"><span class="visually-hidden">Opciones de ${label}</span>${icon("chevron")}</button>
          <ul class="sub" id="${id}">${items.map(([name, route]) => `
            <li><a href="${u(route)}"${cur(route)}>${esc(name)}</a></li>`).join("")}
          </ul>`;
  return `
  <div class="utility">
    <div class="wrap utility-inner">
      <a href="${esc(SITIO.plataforma)}" target="_blank" rel="noopener">Plataforma estudiantes</a>
      <a href="${esc(SITIO.preinscripcion)}" target="_blank" rel="noopener">Preinscripción</a>
      <a href="tel:+57${SITIO.telefonos[0].replace(/\s/g, "")}" class="utility-tel">${SITIO.telefonos[0]}</a>
    </div>
  </div>
  <header class="site-header">
    <div class="wrap header-inner">
      <a href="${u()}" class="brand" aria-label="Compusis de Colombia, inicio">
        <img src="${u("assets/logo.png")}" alt="Compusis de Colombia" width="200" height="50">
      </a>
      <a class="wa-quick" href="${wa("Hola Compusis, quiero más información")}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">${icon("chat")}</a>
      <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="menu">Menú</button>
      <nav id="menu" class="nav" aria-label="Principal">
        <ul class="nav-list">
          <li${active("inicio")}><a href="${u()}"${cur("")}>Inicio</a></li>
          <li class="has-sub${p.section === "educacion" ? " is-active" : ""}">
            <a href="${u("educacion/")}"${cur("educacion/")}>Educación</a>${sub("sub-educacion", "Educación", [
              ["Técnicos laborales", "educacion/tecnicos/"],
              ["Cursos cortos", "educacion/cursos/"],
              ["Capacitación empresarial", "educacion/empresas/"],
            ])}
          </li>
          <li class="has-sub${p.section === "tecnologia" ? " is-active" : ""}">
            <a href="${u("tecnologia/")}"${cur("tecnologia/")}>Tecnología</a>${sub("sub-tecnologia", "Tecnología", [
              ["Ver todo el portafolio", "tecnologia/productos/"],
              ...GROUPS.map((g) => [g.name, `tecnologia/categoria/${g.slug}/`]),
            ])}
          </li>
          <li${active("empresas")}><a href="${u("empresas/")}"${cur("empresas/")}>Empresas</a></li>
          <li${active("nosotros")}><a href="${u("nosotros/")}"${cur("nosotros/")}>Nosotros</a></li>
          <li${active("contacto")}><a href="${u("contacto/")}"${cur("contacto/")}>Contacto</a></li>
        </ul>
        <a class="btn btn-red btn-sm nav-wa" href="${wa("Hola Compusis, quiero más información")}" target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
      </nav>
    </div>
  </header>`;
}

function footer(u) {
  const col = (title, links) => `
        <div>
          <h2>${title}</h2>
          <ul>${links.map(([name, href, ext]) => `<li><a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(name)}</a></li>`).join("")}</ul>
        </div>`;
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="${u("assets/logo-sello.png")}" alt="Compusis de Colombia" width="180" height="50" loading="lazy">
          <p>Fortalecemos el talento, impulsamos la tecnología.</p>
          <p class="footer-phones">${SITIO.telefonos.map((t) => `<a href="tel:+57${t.replace(/\s/g, "")}">${t}</a>`).join(" · ")}<br><a href="mailto:${SITIO.correo}">${SITIO.correo}</a></p>
        </div>${col("Educación", [
          ["Técnicos laborales", u("educacion/tecnicos/")],
          ["Cursos cortos", u("educacion/cursos/")],
          ["Capacitación empresarial", u("educacion/empresas/")],
          ["Preinscripción", SITIO.preinscripcion, true],
          ["Plataforma estudiantes", SITIO.plataforma, true],
        ])}${col("Tecnología", [
          ["Portafolio", u("tecnologia/productos/")],
          ["Industrias", u("tecnologia/#industrias")],
          ["Marcas", u("tecnologia/#marcas")],
          ["Guías y recursos", u("tecnologia/#recursos")],
        ])}${col("Compusis", [
          ["Empresas", u("empresas/")],
          ["Nosotros", u("nosotros/")],
          ["Contacto", u("contacto/")],
          ["Política de tratamiento de datos", u("privacidad/")],
        ])}
        <div>
          <h2>Sedes</h2>
          <ul class="footer-sedes">${SEDES.map((s) => `<li><a href="${esc(s.map)}" target="_blank" rel="noopener"><strong>${s.name}</strong> ${esc(s.address)}</a></li>`).join("")}</ul>
        </div>
      </div>
      <p class="footer-legal">© ${year} Compusis de Colombia. ${esc(ETDH.replace("COMPUSIS DE COLOMBIA", "Compusis de Colombia"))}</p>
    </div>
  </footer>`;
}

const crumbs = (u, items) => `
    <nav class="crumbs" aria-label="Ruta de navegación">
      <ol>${items.map(([name, route], i) => (i === items.length - 1
        ? `<li><span aria-current="page">${esc(name)}</span></li>`
        : `<li><a href="${u(route)}">${esc(name)}</a></li>`)).join("")}</ol>
    </nav>`;

function pageHead(p, u, { tag = "", title, lead = "", actions = "", extra = "", tone = "" }) {
  return `
    <section class="page-head${tone ? ` page-head-${tone}` : ""}">
      <div class="wrap">${p.crumbs ? crumbs(u, p.crumbs) : ""}
        ${tag ? `<p class="eyebrow">${esc(tag)}</p>` : ""}
        <h1>${esc(title)}</h1>
        ${lead ? `<p class="page-lead">${lead}</p>` : ""}
        ${actions ? `<div class="btn-row">${actions}</div>` : ""}${extra}
      </div>
    </section>`;
}

const btn = (cls, href, label, ext = true) => `<a class="btn ${cls}" href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ""}>${esc(label)}</a>`;
const btnPre = (label = "Preinscríbete en línea") => btn("btn-red", SITIO.preinscripcion, label);
const etdhNote = () => `<p class="etdh-note">${esc(ETDH).replace("COMPUSIS DE COLOMBIA", "<strong>COMPUSIS DE COLOMBIA</strong>")}</p>`;

function sectionHead(title, text = "", id = "") {
  return `
        <div class="section-head">
          <h2${id ? ` id="${id}"` : ""}>${esc(title)}</h2>
          ${text ? `<p>${text}</p>` : ""}
        </div>`;
}

function ctaBand({ title, text, buttons }) {
  return `
    <section class="cta-band">
      <div class="wrap cta-inner">
        <div>
          <h2>${esc(title)}</h2>
          ${text ? `<p>${text}</p>` : ""}
        </div>
        <div class="btn-row">${buttons}</div>
      </div>
    </section>`;
}

function tecnicoCard(u, t) {
  const s = sedeById[t.sede];
  return `
          <li class="card card-edu" data-sede="${t.sede}">
            <p class="tag">Técnico laboral · Sede ${esc(s.name)}</p>
            <h3><a class="card-link" href="${u(`educacion/tecnicos/${t.slug}/`)}">${esc(t.name)}</a></h3>
            <p class="card-meta">${esc(t.resolucion)}</p>
            <span class="card-more" aria-hidden="true">Ver programa</span>
          </li>`;
}

function courseCard(u, c) {
  return `
          <li class="card card-edu" data-area="${slugify(c.area)}" data-modalidad="${c.modalidades.join(" ")}">
            <p class="tag">Curso corto · ${esc(c.area)}</p>
            <h3><a class="card-link" href="${u(`educacion/cursos/${c.slug}/`)}">${esc(c.name)}</a></h3>
            <p class="card-meta">${esc(c.meta)}</p>
            <p class="card-text">${esc(c.teaser)}</p>
            <span class="card-more" aria-hidden="true">Ver curso</span>
          </li>`;
}

const specRows = (rows) => rows.map(([k, v]) => `<div class="spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
const searchText = (p) => fold([p.name, p.desc, ...p.specs.flat(), ...groupsOf(p).map((g) => g.name)].join(" "));

function productCard(u, p) {
  return `
          <li class="card card-tech product-card" data-grupo="${groupsOf(p).map((g) => g.slug).join(" ")}" data-search="${esc(searchText(p))}">
            <div class="product-img"><img src="${u(`assets/productos/${p.img}.webp`)}" alt="" loading="lazy" width="400" height="400"></div>
            <div class="card-body">
              <p class="tag">${esc(mainGroup(p).name)}</p>
              <h3><a class="card-link" href="${u(`tecnologia/productos/${p.id}/`)}">${esc(p.name)}</a></h3>
              <p class="warranty">${p.warranty ? esc(p.warranty) : "Precio por volumen, consúltanos"}</p>
              <dl class="specs">${specRows(p.specs.slice(0, 2))}</dl>
              <div class="card-actions">
                <span class="card-more" aria-hidden="true">Ver ficha</span>
                ${btn("btn-navy btn-sm", wa(`Hola Compusis, quiero cotizar: ${p.name}`), "Cotizar")}
              </div>
            </div>
          </li>`;
}

function groupCard(u, g) {
  const items = groupProducts(g);
  return `
          <li class="card card-tech group-card">
            <div class="product-img"><img src="${u(`assets/productos/${items[0].img}.webp`)}" alt="" loading="lazy" width="400" height="400"></div>
            <div class="card-body">
              <h3><a class="card-link" href="${u(`tecnologia/categoria/${g.slug}/`)}">${esc(g.name)}</a></h3>
              <p class="card-text">${esc(g.desc)}</p>
              <span class="card-more" aria-hidden="true">${items.length} ${items.length === 1 ? "equipo" : "equipos"}</span>
            </div>
          </li>`;
}

function chips(name, label, options, total) {
  return `
          <div class="chips" role="group" aria-label="${esc(label)}" data-filter="${name}">
            <button type="button" aria-pressed="true" data-value="">Todos <span>${total}</span></button>${options.map(([value, text, n]) => `
            <button type="button" aria-pressed="false" data-value="${value}">${esc(text)} <span>${n}</span></button>`).join("")}
          </div>`;
}

function listing({ toolbar, items, empty, label }) {
  return `
        <div class="listing" data-listing>
          <div class="toolbar" data-toolbar hidden>${toolbar}
          </div>
          <p class="result-count" data-count aria-live="polite"></p>
          <ul class="card-grid" data-items aria-label="${esc(label)}">${items}
          </ul>
          <p class="empty" data-empty hidden>${empty}</p>
        </div>`;
}

const sedesBlock = () => `
        <dl class="campus-list">${SEDES.map((s) => `
          <div><dt>Sede ${esc(s.name)}</dt><dd><a href="${esc(s.map)}" target="_blank" rel="noopener">${esc(s.address)}</a></dd></div>`).join("")}
        </dl>`;

const industriasGrid = (u) => `
        <div class="sector-grid">${INDUSTRIAS.map((i) => `
          <figure class="sector">
            <img src="${u(`assets/fotos/${i.img}.webp`)}" alt="${esc(i.alt)}" loading="lazy" width="800" height="1000">
            <figcaption><strong>${esc(i.name)}</strong> ${esc(i.desc)}</figcaption>
          </figure>`).join("")}
        </div>`;

const stats = () => `
        <ul class="stats">
          <li><strong>+30 años</strong><span>formando talento para el mundo laboral</span></li>
          <li><strong>3 sedes</strong><span>en ${SEDES.map((s) => s.name).join(", ").replace(/, ([^,]*)$/, " y $1")}</span></li>
          <li><strong>NTC 5555</strong><span>sistema de gestión de la calidad educativa</span></li>
          <li><strong>Marcas líderes</strong><span>${MARCAS.slice(0, 3).map((m) => m[1]).join(", ")} y más, con garantía</span></li>
        </ul>`;

const qualityBlock = (u) => `
        <div class="quality">
          <div>
            <h2>Comprometidos con la calidad educativa</h2>
            <p>En Compusis trabajamos por una formación de calidad, enfocada en el desarrollo de competencias y la mejora continua de nuestros procesos académicos y administrativos.</p>
            <p>Nuestra propuesta educativa se fundamenta en el aprendizaje práctico, el acompañamiento al estudiante y la preparación para las necesidades del sector productivo.</p>
          </div>
          <div class="seal">
            <p class="seal-title">NTC 5555</p>
            <p>Norma Técnica Colombiana de calidad para instituciones de formación para el trabajo.</p>
          </div>
        </div>
        <div class="recognitions">
          <h3>Reconocimientos y respaldos</h3>
          <ul>
            <li><img src="${u("assets/reconocimientos/los-mejores-en-educacion.webp")}" alt="" loading="lazy" width="352" height="274"><span>Reconocimiento Los Mejores en Educación</span></li>
            <li><img src="${u("assets/reconocimientos/sena.png")}" alt="" loading="lazy" width="246" height="240"><span>Programas registrados ante el SENA</span></li>
            <li><img src="${u("assets/reconocimientos/asenof.webp")}" alt="" loading="lazy" width="277" height="208"><span>Asenof, Agencia de Empleo</span></li>
            <li><svg class="rec-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 14l2 2 4-4"/></svg><span>Programas aprobados por la Secretaría de Educación</span></li>
          </ul>
        </div>`;

function contactForm(u) {
  return `
        <form class="quote" id="quote" data-wa="${SITIO.whatsapp}">
          <label>Nombre <input name="nombre" required autocomplete="name"></label>
          <label>Empresa <input name="empresa" autocomplete="organization"></label>
          <label>Me interesa
            <select name="interes">
              <option>Programas técnicos laborales</option>
              <option>Cursos cortos</option>
              <option>Capacitación para mi empresa</option>
              <option>Equipos y soluciones tecnológicas</option>
            </select>
          </label>
          <label>¿Qué necesitas?
            <textarea name="mensaje" rows="4" required placeholder="Ej.: información del curso de Excel Básico, o 3 impresoras de recibos para nuestras cajas"></textarea>
          </label>
          <label class="consent">
            <input type="checkbox" name="autorizo" required>
            <span>Autorizo a Compusis de Colombia a tratar mis datos personales para atender mi solicitud y enviarme información de sus programas y servicios, conforme a la Ley 1581 de 2012 y a la <a href="${u("privacidad/")}" target="_blank">Política de tratamiento de datos personales</a>.</span>
          </label>
          <button class="btn btn-red" type="submit">Enviar por WhatsApp</button>
          <p class="form-hint">Se abrirá WhatsApp con tu mensaje listo para enviar.</p>
        </form>`;
}

// ---------- Inicio ----------
page({
  route: "",
  section: "inicio",
  title: "Compusis de Colombia | Educación para el trabajo y soluciones tecnológicas",
  fullTitle: true,
  desc: "Más de 30 años formando talento: técnicos laborales, cursos cortos y capacitación empresarial en Bogotá, Ibagué y Girardot. Soluciones tecnológicas para empresas.",
  bodyAttr: ' data-page="inicio"',
  jsonld: {
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    name: SITIO.nombre,
    description: "Institución de Educación para el Trabajo y el Desarrollo Humano con más de 30 años de trayectoria, y comercializadora de soluciones tecnológicas para empresas.",
    url: SITIO.BASE_URL,
    image: `${SITIO.BASE_URL}assets/og.jpg`,
    logo: `${SITIO.BASE_URL}assets/logo.png`,
    email: SITIO.correo,
    telephone: SITIO.telefonos.map((t) => `+57 ${t}`),
    address: { "@type": "PostalAddress", streetAddress: "Calle 17 N.º 98-90, piso 2", addressLocality: "Bogotá", addressRegion: "Bogotá D. C.", addressCountry: "CO" },
    sameAs: ["https://www.compusis.edu.co"],
  },
  body: (u) => {
    const eduFeatured = [...TECNICOS.filter((t) => t.destacado).map((t) => tecnicoCard(u, t)), ...CURSOS.filter((c) => c.destacado).map((c) => courseCard(u, c))].slice(0, 3);
    return `
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <h1>Fortalecemos el talento, impulsamos la tecnología.</h1>
          <p class="hero-kicker">Más de 30 años formando talento. Hoy también impulsamos empresas con tecnología.</p>
          <p class="lede">En Compusis de Colombia contamos con dos líneas de negocio especializadas: educación para el trabajo, con más de 30 años de trayectoria formando talento humano, y comercialización de soluciones tecnológicas, orientadas a optimizar procesos, mejorar la eficiencia e impulsar la productividad empresarial.</p>
          <div class="hero-actions">
            <a class="btn btn-red" href="${u("educacion/")}">Explora nuestros programas</a>
            <a class="btn btn-navy" href="${u("tecnologia/")}">Descubre nuestras soluciones</a>
          </div>
        </div>
        <div class="hero-media" aria-hidden="true">
          <div class="slash slash-navy"></div>
          <div class="slash slash-red"></div>
          <div class="hero-panels">
            <img src="${u("assets/fotos/hero-educacion.webp")}" alt="" class="hero-top" width="1600" height="1067">
            <div class="hero-bottom">
              <div class="band band-red"></div>
              <div class="band band-navy"></div>
              <img src="${u("assets/fotos/hero-tecnologia.webp")}" alt="" width="1600" height="1067">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("Dos líneas de negocio, un mismo propósito", "Elige lo que necesitas: formación para ti o tu equipo, o tecnología para tu empresa.")}
        <ul class="line-cards">
          <li class="line-card line-edu">
            <img src="${u("assets/fotos/formacion-equipo.webp")}" alt="" loading="lazy" width="1600" height="900">
            <div class="line-body">
              <p class="eyebrow">Educación para el Trabajo y el Desarrollo Humano</p>
              <h3><a class="card-link" href="${u("educacion/")}">Formación que impulsa tu desarrollo profesional</a></h3>
              <p>Técnicos laborales, cursos cortos y capacitación empresarial con enfoque práctico.</p>
              <span class="card-more" aria-hidden="true">Ir a Educación</span>
            </div>
          </li>
          <li class="line-card line-tech">
            <img src="${u("assets/fotos/caja.webp")}" alt="" loading="lazy" width="1600" height="1067">
            <div class="line-body">
              <p class="eyebrow">Soluciones tecnológicas para empresas</p>
              <h3><a class="card-link" href="${u("tecnologia/")}">Tecnología que optimiza procesos e impulsa tu productividad</a></h3>
              <p>Asesoramos y suministramos equipos de punto de venta, impresión, etiquetado e identificación.</p>
              <span class="card-more" aria-hidden="true">Ir a Tecnología</span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="featured-head">
          <h2>Programas destacados</h2>
          <a class="text-link" href="${u("educacion/")}">Ver toda la oferta educativa</a>
        </div>
        <ul class="card-grid card-grid-3">${eduFeatured.join("")}
        </ul>
        <div class="featured-head">
          <h2>Categorías de tecnología</h2>
          <a class="text-link" href="${u("tecnologia/productos/")}">Ver todo el portafolio</a>
        </div>
        <ul class="card-grid card-grid-3">${GROUPS.slice(0, 3).map((g) => groupCard(u, g)).join("")}
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("¿Por qué Compusis?")}${stats()}
      </div>
    </section>
${ctaBand({
      title: "¿Hablamos?",
      text: "Te asesoramos para elegir tu programa de formación o la solución tecnológica que necesita tu empresa.",
      buttons: `${btn("btn-red", wa("Hola Compusis, quiero asesoría académica sobre sus programas"), "Asesoría académica")}${btn("btn-light", wa("Hola Compusis, quiero asesoría comercial sobre equipos y soluciones"), "Asesoría comercial")}`,
    })}`;
  },
});

// ---------- Educación ----------
const EDU_CRUMB = ["Educación", "educacion/"];

page({
  route: "educacion/",
  section: "educacion",
  title: "Educación",
  desc: "Técnicos laborales, cursos cortos y capacitación empresarial en Bogotá, Ibagué y Girardot. Institución de Educación para el Trabajo y el Desarrollo Humano.",
  crumbs: [["Inicio", ""], EDU_CRUMB],
  body: (u, p) => `${pageHead(p, u, {
    tag: "Educación para el Trabajo y el Desarrollo Humano",
    title: "Formación que impulsa tu desarrollo profesional",
    lead: "En Compusis formamos personas y fortalecemos habilidades para el mundo laboral, con un enfoque práctico, horarios flexibles y formación adaptada a las necesidades de estudiantes y empresas.",
    actions: `${btnPre()}${btn("btn-ghost", wa("Hola Compusis, quiero conocer sus programas e inscribirme"), "Resolver dudas por WhatsApp")}`,
    extra: `
        <p class="student-access">¿Ya eres estudiante? <a class="text-link" href="${esc(SITIO.plataforma)}" target="_blank" rel="noopener">Ingresa a la plataforma académica</a> para subir talleres y consultar tu asistencia.</p>`,
  })}

    <section class="section">
      <div class="wrap">${sectionHead("¿Qué quieres estudiar?", "Elige el tipo de formación que mejor se ajusta a tus objetivos.")}
        <ul class="card-grid card-grid-3">
          <li class="card card-edu cat-card">
            ${icon("cap", "cat-icon")}
            <h3><a class="card-link" href="${u("educacion/tecnicos/")}">Técnicos laborales</a></h3>
            <p class="card-text">Programas por competencias con registro oficial, que conducen a un Certificado de Aptitud Ocupacional.</p>
            <span class="card-more" aria-hidden="true">${TECNICOS.length} programas en ${SEDES_TEC.map((s) => s.name).join(" y ")}</span>
          </li>
          <li class="card card-edu cat-card">
            ${icon("book", "cat-icon")}
            <h3><a class="card-link" href="${u("educacion/cursos/")}">Cursos cortos</a></h3>
            <p class="card-text">Aprende hoy lo que necesitas para avanzar profesionalmente, con cursos 100% prácticos.</p>
            <span class="card-more" aria-hidden="true">${CURSOS.length} cursos</span>
          </li>
          <li class="card card-edu cat-card">
            ${icon("team", "cat-icon")}
            <h3><a class="card-link" href="${u("educacion/empresas/")}">Capacitación empresarial</a></h3>
            <p class="card-text">Cursos, seminarios, talleres y diplomados diseñados para tu equipo de trabajo.</p>
            <span class="card-more" aria-hidden="true">Formación a la medida</span>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="mv-edu" id="institucional">
          <div class="mv-edu-head">
            <h2>Misión y visión institucional</h2>
            <p>Definidas en nuestro Proyecto Educativo Institucional (PEI) y en el Sistema de Gestión de la Calidad bajo la NTC 5555.</p>
          </div>
          <dl class="mv">
            <dt>Misión</dt>
            <dd>Capacitar integralmente al estudiante para que adquiera las competencias necesarias que le permitan desempeñarse en el sector productivo, de acuerdo a la demanda tecnológica y empresarial de la actualidad, mediante metodologías prácticas que desarrollen sus habilidades y destrezas.</dd>
            <dt>Visión</dt>
            <dd>Ser reconocida en el 2030 a nivel nacional como una de las mejores Instituciones de Educación para el Trabajo y el Desarrollo Humano, tendientes a la innovación permanente, a la adopción de nuevas estrategias metodológicas, actualización y creación de programas de acuerdo a la demanda del sector productivo.</dd>
          </dl>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${qualityBlock(u)}
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap two-col">
        <div>
          <h2>Estamos cerca de ti</h2>
          <p class="muted">Encuentra la sede más cercana. Toca la dirección para verla en el mapa.</p>
        </div>${sedesBlock()}
      </div>
    </section>
${ctaBand({
    title: "¡Inscríbete y comienza a fortalecer tu futuro!",
    text: "En Compusis te acompañamos a desarrollar habilidades que aportan a tu crecimiento personal y profesional.",
    buttons: `${btnPre()}${btn("btn-light", wa("Hola Compusis, quiero consultar horarios e inscripciones"), "Consulta horarios e inscripciones")}`,
  })}
    <div class="wrap legal-strip">${etdhNote()}</div>`,
});

// Técnicos: listado
page({
  route: "educacion/tecnicos/",
  section: "educacion",
  title: "Técnicos laborales",
  desc: `Programas técnicos laborales por competencias con registro oficial en ${SEDES_TEC.map((s) => s.name).join(" y ")}.`,
  crumbs: [["Inicio", ""], EDU_CRUMB, ["Técnicos laborales", "educacion/tecnicos/"]],
  body: (u, p) => `${pageHead(p, u, {
    title: "Programas técnicos laborales por competencias",
    lead: `Programas con registro oficial en nuestras sedes de ${SEDES_TEC.map((s) => s.name).join(" y ")}.`,
    actions: `${btnPre("Preinscríbete a un programa")}${btn("btn-ghost", wa("Hola Compusis, quiero información sobre los programas técnicos laborales"), "Solicitar información")}`,
  })}

    <section class="section">
      <div class="wrap">${listing({
    label: "Programas técnicos laborales",
    toolbar: chips("sede", "Filtrar por sede", SEDES_TEC.map((s) => [s.id, `Sede ${s.name}`, TECNICOS.filter((t) => t.sede === s.id).length]), TECNICOS.length),
    items: TECNICOS.map((t) => tecnicoCard(u, t)).join(""),
    empty: "No hay programas para esta sede por ahora.",
  })}
        ${etdhNote()}
      </div>
    </section>`,
});

// Técnicos: fichas
for (const t of TECNICOS) {
  const s = sedeById[t.sede];
  const others = TECNICOS.filter((o) => o.sede === t.sede && o !== t);
  const ask = wa(`Hola Compusis, quiero información sobre el programa ${t.name} (sede ${s.name})`);
  page({
    route: `educacion/tecnicos/${t.slug}/`,
    section: "educacion",
    title: t.name,
    desc: `${t.name}, sede ${s.name}. ${t.resolucion}. Certificado de Aptitud Ocupacional.`,
    crumbs: [["Inicio", ""], EDU_CRUMB, ["Técnicos laborales", "educacion/tecnicos/"], [t.name, `educacion/tecnicos/${t.slug}/`]],
    jsonld: { "@context": "https://schema.org", "@type": "Course", name: t.name, description: t.desc || `Programa técnico laboral por competencias, sede ${s.name}. ${t.resolucion}.`, provider: { "@type": "EducationalOrganization", name: SITIO.nombre, sameAs: SITIO.BASE_URL } },
    body: (u, p) => `${pageHead(p, u, { tag: `Técnico laboral · Sede ${s.name}`, title: t.name, lead: esc(t.resolucion) })}

    <section class="section">
      <div class="wrap detail">
        <div class="detail-main">
          ${t.desc ? `<p class="detail-lead">${esc(t.desc)}</p>` : `<p class="detail-lead">Programa técnico laboral por competencias con registro oficial, ofrecido en nuestra sede de ${esc(s.name)}.</p>`}
          <dl class="course-info">
            <div><dt>Sede</dt><dd>${esc(s.name)}</dd></div>
            <div><dt>Registro</dt><dd>${esc(t.resolucion)}</dd></div>
            <div><dt>Certificación</dt><dd>Certificado de Aptitud Ocupacional como Técnico Laboral por Competencias</dd></div>${(t.info || []).map(([k, v]) => `
            <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
          <div class="accordion">
            <details>
              <summary>¿Cómo me inscribo?</summary>
              <p>Completa el formulario de preinscripción en línea o escríbenos por WhatsApp para recibir información sobre requisitos, horarios y fechas de inicio.</p>
            </details>
            <details>
              <summary>¿Dónde se dicta?</summary>
              <p>Sede ${esc(s.name)}: <a href="${esc(s.map)}" target="_blank" rel="noopener">${esc(s.address)}</a></p>
            </details>
            <details>
              <summary>Información legal</summary>
              <p>${esc(ETDH)}</p>
            </details>
          </div>
        </div>
        <aside class="detail-aside">
          <div class="aside-card">
            <p class="aside-title">¿Te interesa este programa?</p>
            ${btnPre("Preinscríbete en línea")}
            ${btn("btn-ghost", ask, "Solicitar información")}
          </div>
          <a class="back-link" href="${u("educacion/tecnicos/")}">Volver a técnicos laborales</a>
        </aside>
      </div>
    </section>
    ${others.length ? `
    <section class="section section-alt">
      <div class="wrap">
        <div class="featured-head"><h2>Otros programas en la sede ${esc(s.name)}</h2></div>
        <ul class="card-grid card-grid-3">${others.slice(0, 3).map((o) => tecnicoCard(u, o)).join("")}
        </ul>
      </div>
    </section>` : ""}
    <div class="wrap legal-strip">${etdhNote()}</div>`,
  });
}

// Cursos: listado
page({
  route: "educacion/cursos/",
  section: "educacion",
  title: "Cursos cortos",
  desc: "Cursos cortos 100% prácticos: Excel, sistemas, nómina y marketing digital. Presenciales y virtuales.",
  crumbs: [["Inicio", ""], EDU_CRUMB, ["Cursos cortos", "educacion/cursos/"]],
  body: (u, p) => `${pageHead(p, u, {
    title: "Cursos cortos para fortalecer tus habilidades",
    lead: "Aprende hoy lo que necesitas para avanzar profesionalmente.",
    actions: `${btn("btn-red", wa("Hola Compusis, quiero conocer sus cursos e inscribirme"), "Conoce nuestros cursos e inscríbete")}${btn("btn-ghost", SITIO.preinscripcion, "Preinscríbete en línea")}`,
  })}

    <section class="section">
      <div class="wrap">${listing({
    label: "Cursos cortos",
    toolbar: chips("area", "Filtrar por área", AREAS.map((a) => [slugify(a), a, CURSOS.filter((c) => c.area === a).length]), CURSOS.length)
      + chips("modalidad", "Filtrar por modalidad", [["presencial", "Presencial"], ["virtual", "Virtual"]].map(([v, n]) => [v, n, CURSOS.filter((c) => c.modalidades.includes(v)).length]).filter((o) => o[2] > 0), CURSOS.length),
    items: CURSOS.map((c) => courseCard(u, c)).join(""),
    empty: "No hay cursos con esa combinación. Prueba con otro filtro.",
  })}
      </div>
    </section>
${ctaBand({
    title: "¿No sabes cuál curso elegir?",
    text: "Cuéntanos qué quieres aprender y te recomendamos el curso y el horario que mejor se ajustan a ti.",
    buttons: btn("btn-red", wa("Hola Compusis, quiero que me recomienden un curso"), "Pedir recomendación"),
  })}`,
});

// Cursos: fichas
for (const c of CURSOS) {
  const related = [...CURSOS.filter((o) => o !== c && o.area === c.area), ...CURSOS.filter((o) => o !== c && o.area !== c.area)].slice(0, 3);
  page({
    route: `educacion/cursos/${c.slug}/`,
    section: "educacion",
    title: c.name,
    desc: c.desc,
    crumbs: [["Inicio", ""], EDU_CRUMB, ["Cursos cortos", "educacion/cursos/"], [c.name, `educacion/cursos/${c.slug}/`]],
    jsonld: { "@context": "https://schema.org", "@type": "Course", name: c.name, description: c.desc, provider: { "@type": "EducationalOrganization", name: SITIO.nombre, sameAs: SITIO.BASE_URL } },
    body: (u, p) => `${pageHead(p, u, { tag: `Curso corto · ${c.area}`, title: c.name, lead: esc(c.meta) })}

    <section class="section">
      <div class="wrap detail">
        <div class="detail-main">
          <p class="detail-lead">${esc(c.desc)}</p>
          <dl class="course-info">${c.info.map(([k, v]) => `
            <div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
          <h2 class="detail-sub">¿Qué aprenderás?</h2>
          <ul class="check-list">${c.temas.map((t) => `
            <li>${esc(t)}</li>`).join("")}
          </ul>
        </div>
        <aside class="detail-aside">
          <div class="aside-card">
            <p class="aside-title">¿Te interesa este curso?</p>
            ${btn("btn-red", wa(`Hola Compusis, quiero información sobre el curso ${c.name}`), "Solicitar información")}
            ${btn("btn-ghost", SITIO.preinscripcion, "Preinscríbete en línea")}
          </div>
          <a class="back-link" href="${u("educacion/cursos/")}">Volver a cursos cortos</a>
        </aside>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">
        <div class="featured-head"><h2>También te puede interesar</h2></div>
        <ul class="card-grid card-grid-3">${related.map((o) => courseCard(u, o)).join("")}
        </ul>
      </div>
    </section>`,
  });
}

// Capacitación empresarial
const AREAS_EMPRESA = [
  "Excel y herramientas ofimáticas",
  "Nómina y prestaciones sociales",
  "Contabilidad para no contadores",
  "Marketing digital y redes sociales",
  "Ventas y servicio al cliente",
  "Mantenimiento de computadores y redes",
];
const quoteTraining = wa("Hola Compusis, quiero cotizar una capacitación para mi empresa");

page({
  route: "educacion/empresas/",
  section: "educacion",
  title: "Capacitación empresarial",
  desc: "Capacitación a la medida para empresas: cursos, seminarios, talleres y diplomados en el horario y la modalidad que necesita tu equipo.",
  crumbs: [["Inicio", ""], EDU_CRUMB, ["Capacitación empresarial", "educacion/empresas/"]],
  body: (u, p) => `${pageHead(p, u, {
    tag: "Para empresas",
    title: "Capacitación a la medida para empresas",
    lead: "Diseñamos cursos, seminarios, talleres y diplomados según lo que necesita tu equipo de trabajo, en el horario y la modalidad que mejor le funcionen a tu empresa.",
    actions: btn("btn-red", quoteTraining, "Cotizar una capacitación"),
    tone: "dark",
  })}

    <section class="section">
      <div class="wrap">${sectionHead("Áreas de capacitación", "Partimos de estos temas y los ajustamos a los procesos y al nivel de tu equipo.")}
        <ul class="area-grid">${AREAS_EMPRESA.map((a) => `
          <li>${esc(a)}</li>`).join("")}
        </ul>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">${sectionHead("Modalidades de formación")}
        <ul class="card-grid card-grid-3">
          <li class="card card-edu"><h3>Cursos, seminarios, talleres y diplomados</h3><p class="card-text">Elige el formato según la profundidad y el tiempo disponible de tu equipo.</p></li>
          <li class="card card-edu"><h3>Presencial o virtual</h3><p class="card-text">Formación en la modalidad que mejor se adapte a tu operación.</p></li>
          <li class="card card-edu"><h3>En tu horario</h3><p class="card-text">Programamos las sesiones en los días y horas que defina tu empresa.</p></li>
        </ul>
      </div>
    </section>

    <section class="section">
      <div class="wrap">${sectionHead("Beneficios para tu empresa")}
        <ul class="benefits">
          <li><strong>Formación práctica</strong> Ejercicios aplicados al día a día de tu equipo.</li>
          <li><strong>Contenido a la medida</strong> Ajustamos temas y nivel a tus procesos.</li>
          <li><strong>Más de 30 años de experiencia</strong> Formando talento para el sector productivo.</li>
          <li><strong>Calidad NTC 5555</strong> Procesos académicos bajo un sistema de gestión de la calidad.</li>
        </ul>
      </div>
    </section>
${ctaBand({
    title: "Cuéntanos qué necesita tu equipo",
    text: "Te enviamos una propuesta de capacitación con temas, duración y modalidad.",
    buttons: `${btn("btn-red", quoteTraining, "Cotizar una capacitación")}${btn("btn-light", wa("Hola Compusis, quiero asesoría para capacitar a mi equipo"), "Hablar con un asesor")}`,
  })}`,
});

// ---------- Tecnología ----------
const TEC_CRUMB = ["Tecnología", "tecnologia/"];
const askSales = wa("Hola Compusis, quiero asesoría sobre equipos y soluciones tecnológicas");

page({
  route: "tecnologia/",
  section: "tecnologia",
  title: "Tecnología",
  desc: "Soluciones tecnológicas para empresas: punto de venta, impresión y etiquetado, lectores e identificación y suministros.",
  crumbs: [["Inicio", ""], TEC_CRUMB],
  body: (u, p) => `${pageHead(p, u, {
    tag: "Soluciones tecnológicas para empresas",
    title: "Tecnología que optimiza procesos e impulsa tu productividad",
    lead: "Somos tu aliado estratégico en tecnología. Asesoramos y suministramos equipos y soluciones que agilizan operaciones, mejoran la eficiencia y se adaptan a las necesidades de tu empresa.",
    actions: `<a class="btn btn-navy" href="${u("tecnologia/productos/")}">Ver todo el portafolio</a>${btn("btn-ghost", askSales, "Solicitar asesoría")}`,
  })}

    <section class="section">
      <div class="wrap">${sectionHead("Categorías", "Precios y disponibilidad por cotización.")}
        <ul class="card-grid">${GROUPS.map((g) => groupCard(u, g)).join("")}
        </ul>
        <p class="more-row"><a class="btn btn-navy" href="${u("tecnologia/productos/")}">Ver todo el portafolio (${PRODUCTS.length} equipos)</a></p>
      </div>
    </section>

    <section class="solutions">
      <div class="wrap solutions-grid">
        <h2>Soluciones que se adaptan a tu operación</h2>
        <div>
          <ul class="areas">
            <li>Punto de venta</li><li>Señalización digital</li><li>Etiquetado</li><li>Flexografía</li><li>Suministros</li><li>Carnetización</li><li>Pesaje</li><li>Seguridad</li><li>Computadores</li><li>Proyección</li><li>Inventarios</li><li>Bodegas</li><li>Producción</li><li>Transporte</li><li>Retail</li>
          </ul>
          <p class="solutions-note"><strong>¿Tienes un requerimiento diferente?</strong> Cuéntanos qué necesitas. Si no está dentro de este portafolio, trabajamos con nuestra red de aliados para encontrar la solución adecuada para tu empresa.</p>
        </div>
      </div>
    </section>

    <section class="section" id="industrias">
      <div class="wrap">${sectionHead("Soluciones por industria", "En cada industria acompañamos a nuestros clientes con soluciones que se adaptan a sus necesidades.")}${industriasGrid(u)}
      </div>
    </section>

    <section class="section section-alt" id="recursos">
      <div class="wrap">${sectionHead("Guías y recursos", "Antes de comprar etiquetas o cintas, revisa qué material y qué adhesivo pide tu aplicación. Toca una guía para verla en tamaño completo.")}
        <div class="guide-grid">${GUIAS.map((g) => `
          <a class="guide" href="${u(`assets/fotos/${g.img}.webp`)}" target="_blank" rel="noopener">
            <img src="${u(`assets/fotos/${g.img}.webp`)}" alt="${esc(g.alt)}" loading="lazy">
            <span><strong>${esc(g.name)}</strong> ${esc(g.desc)}</span>
          </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section brands" id="marcas">
      <div class="wrap">
        <h2>Marcas en portafolio</h2>
        <ul class="brand-list">${MARCAS.map(([f, n]) => `
          <li><img src="${u(`assets/marcas/${f}.png`)}" alt="${esc(n)}" loading="lazy"></li>`).join("")}
        </ul>
      </div>
    </section>
${ctaBand({
    title: "¿Necesitas equipar tu operación?",
    text: "Cuéntanos qué necesitas y te enviamos opciones y una cotización.",
    buttons: `${btn("btn-red", wa("Hola Compusis, quiero una cotización de equipos"), "Solicitar cotización")}${btn("btn-light", askSales, "Hablar con un asesor")}`,
  })}`,
});

// Portafolio completo
page({
  route: "tecnologia/productos/",
  section: "tecnologia",
  title: "Portafolio de equipos",
  desc: "Portafolio de equipos: cajones monederos, impresoras de recibos y etiquetas, lectores de códigos, impresoras de carnets y suministros.",
  crumbs: [["Inicio", ""], TEC_CRUMB, ["Portafolio", "tecnologia/productos/"]],
  body: (u, p) => `${pageHead(p, u, {
    title: "Portafolio",
    lead: "Precios y disponibilidad por cotización. Si necesitas algo que no está aquí, lo buscamos con nuestra red de aliados.",
  })}

    <section class="section">
      <div class="wrap">${listing({
    label: "Equipos",
    toolbar: `
            <label class="search">${icon("search", "search-icon")}<span class="visually-hidden">Buscar productos</span><input type="search" data-search placeholder="Buscar por nombre, marca o característica" autocomplete="off"></label>`
      + chips("grupo", "Filtrar por categoría", GROUPS.map((g) => [g.slug, g.name, groupProducts(g).length]), PRODUCTS.length),
    items: PRODUCTS.map((x) => productCard(u, x)).join(""),
    empty: `No encontramos equipos con esa búsqueda. <a class="text-link" href="${esc(wa("Hola Compusis, busco un equipo que no está en el portafolio"))}" target="_blank" rel="noopener">Pregúntanos por WhatsApp</a>, lo buscamos con nuestra red de aliados.`,
  })}
      </div>
    </section>`,
});

// Categorías
for (const g of GROUPS) {
  page({
    route: `tecnologia/categoria/${g.slug}/`,
    section: "tecnologia",
    title: g.name,
    desc: `${g.name}: ${g.desc}`,
    crumbs: [["Inicio", ""], TEC_CRUMB, [g.name, `tecnologia/categoria/${g.slug}/`]],
    body: (u, p) => `${pageHead(p, u, { tag: "Categoría", title: g.name, lead: esc(g.desc) })}

    <section class="section">
      <div class="wrap">
        <ul class="card-grid">${groupProducts(g).map((x) => productCard(u, x)).join("")}
        </ul>
        <nav class="other-cats" aria-label="Otras categorías">
          <p>Otras categorías:</p>
          <ul>${GROUPS.filter((o) => o !== g).map((o) => `<li><a href="${u(`tecnologia/categoria/${o.slug}/`)}">${esc(o.name)}</a></li>`).join("")}<li><a href="${u("tecnologia/productos/")}">Todo el portafolio</a></li></ul>
        </nav>
      </div>
    </section>
${ctaBand({
      title: `¿Buscas algo en ${g.name.toLowerCase()}?`,
      text: "Te asesoramos para elegir el equipo adecuado para tu operación.",
      buttons: btn("btn-red", wa(`Hola Compusis, quiero asesoría en ${g.name.toLowerCase()}`), "Solicitar asesoría"),
    })}`,
  });
}

// Fichas de producto
for (const x of PRODUCTS) {
  const g = mainGroup(x);
  const sug = (x.sugeridos || []).map((id) => productById[id]).filter(Boolean);
  const ficha = (u) => x.ficha
    ? `<a class="ficha" href="${u(`assets/fichas/${encodeURIComponent(x.ficha)}`)}" target="_blank" rel="noopener">Descargar ficha técnica (PDF)</a>`
    : `<a class="ficha" href="${esc(wa(`Hola Compusis, ¿me pueden enviar la ficha técnica de: ${x.name}?`))}" target="_blank" rel="noopener">Solicitar ficha técnica</a>`;
  page({
    route: `tecnologia/productos/${x.id}/`,
    section: "tecnologia",
    title: x.name,
    desc: x.desc || `${x.name}. ${x.specs.map(([k, v]) => `${k}: ${v}`).join(". ")}.`,
    image: `assets/productos/${x.img}.webp`,
    crumbs: [["Inicio", ""], TEC_CRUMB, [g.name, `tecnologia/categoria/${g.slug}/`], [x.name, `tecnologia/productos/${x.id}/`]],
    body: (u, p) => `
    <section class="page-head page-head-slim">
      <div class="wrap">${crumbs(u, p.crumbs)}</div>
    </section>

    <section class="section">
      <div class="wrap product-detail">
        <div class="product-photo"><img src="${u(`assets/productos/${x.img}.webp`)}" alt="${esc(x.name)}" width="400" height="400"></div>
        <div>
          <p class="eyebrow">${groupsOf(x).map((o) => esc(o.name)).join(" · ")}</p>
          <h1>${esc(x.name)}</h1>
          <p class="warranty">${x.warranty ? esc(x.warranty) : "Precio por volumen, consúltanos"}</p>
          ${x.desc ? `<p class="detail-lead">${esc(x.desc)}</p>` : ""}
          <dl class="specs">${specRows(x.specs)}</dl>
          ${ficha(u)}
          <div class="btn-row">
            ${btn("btn-red", wa(`Hola Compusis, quiero cotizar: ${x.name}`), "Cotizar este equipo")}
            ${btn("btn-ghost", wa(`Hola Compusis, tengo una pregunta sobre: ${x.name}`), "Hacer una pregunta")}
          </div>
          <a class="back-link" href="${u(`tecnologia/categoria/${g.slug}/`)}">Volver a ${esc(g.name.toLowerCase())}</a>
        </div>
      </div>
    </section>
    ${sug.length ? `
    <section class="section section-alt">
      <div class="wrap">
        <div class="featured-head"><h2>Se complementa con</h2></div>
        <ul class="card-grid card-grid-3">${sug.map((o) => productCard(u, o)).join("")}
        </ul>
      </div>
    </section>` : ""}`,
  });
}

// ---------- Empresas ----------
page({
  route: "empresas/",
  section: "empresas",
  title: "Empresas",
  desc: "Soluciones de Compusis para empresas: capacitación a la medida para tu equipo y equipos tecnológicos para tu operación.",
  crumbs: [["Inicio", ""], ["Empresas", "empresas/"]],
  body: (u, p) => `${pageHead(p, u, {
    tag: "Para empresas",
    title: "Talento y tecnología para tu empresa",
    lead: "Capacitamos a tu equipo y te suministramos los equipos que tu operación necesita, con un solo aliado.",
    actions: btn("btn-red", askSales, "Solicitar asesoría comercial"),
    tone: "dark",
  })}

    <section class="section">
      <div class="wrap">
        <ul class="line-cards">
          <li class="line-card line-edu">
            <div class="line-body">
              ${icon("team", "cat-icon")}
              <h3><a class="card-link" href="${u("educacion/empresas/")}">Capacitación empresarial</a></h3>
              <p>Cursos, seminarios, talleres y diplomados a la medida de tu equipo, en el horario y la modalidad que necesites.</p>
              <span class="card-more" aria-hidden="true">Ver capacitación empresarial</span>
            </div>
          </li>
          <li class="line-card line-tech">
            <div class="line-body">
              ${icon("monitor", "cat-icon")}
              <h3><a class="card-link" href="${u("tecnologia/")}">Soluciones y equipos tecnológicos</a></h3>
              <p>${GROUPS.map((g) => g.name).join(", ").replace(/, ([^,]*)$/, " y $1")}, con asesoría y garantía.</p>
              <span class="card-more" aria-hidden="true">Ver soluciones tecnológicas</span>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">${sectionHead("Soluciones por sector", "En cada industria acompañamos a nuestros clientes con soluciones que se adaptan a sus necesidades.")}${industriasGrid(u)}
      </div>
    </section>
${ctaBand({
    title: "Hablemos de tu empresa",
    text: "Un asesor te ayuda a definir la capacitación o los equipos que necesitas.",
    buttons: `${btn("btn-red", askSales, "Asesoría en tecnología")}${btn("btn-light", quoteTraining, "Cotizar una capacitación")}`,
  })}`,
});

// ---------- Nosotros ----------
page({
  route: "nosotros/",
  section: "nosotros",
  title: "Nosotros",
  desc: "Compusis de Colombia: más de 30 años de trayectoria en educación para el trabajo y soluciones tecnológicas para empresas.",
  crumbs: [["Inicio", ""], ["Nosotros", "nosotros/"]],
  body: (u, p) => `${pageHead(p, u, {
    title: "Quiénes somos",
    lead: "Compusis de Colombia es una empresa con más de 30 años de trayectoria y dos líneas de negocio independientes, enfocadas en el desarrollo del talento y la implementación de tecnología para empresas y personas. En cada línea mantenemos un enfoque especializado, profesional y orientado a resultados.",
  })}

    <section class="section">
      <div class="wrap two-col">
        <div>
          <h2>Nuestro propósito</h2>
          <p class="muted">La misión y visión de nuestra institución educativa, definidas en el Proyecto Educativo Institucional, están en <a class="text-link" href="${u("educacion/#institucional")}">Educación</a>.</p>
        </div>
        <dl class="mv">
          <dt>Misión corporativa</dt>
          <dd>Brindar formación tecnológica que fortalezca las habilidades y el conocimiento de los profesionales, junto con equipos de alto desempeño que mejoren la productividad y competitividad de las empresas.</dd>
          <dt>Visión corporativa</dt>
          <dd>Ser referentes en Colombia por impulsar el talento humano y la eficiencia empresarial, mediante la formación tecnológica para el desarrollo profesional y la distribución de hardware que potencia la transformación digital.</dd>
        </dl>
      </div>
    </section>

    <section class="section section-alt">
      <div class="wrap">${stats()}
      </div>
    </section>

    <section class="section">
      <div class="wrap two-col">
        <div>
          <h2>Nuestras sedes</h2>
          <p class="muted">Toca la dirección para verla en el mapa.</p>
        </div>${sedesBlock()}
      </div>
    </section>
${ctaBand({
    title: "Conoce nuestras dos líneas de negocio",
    text: "",
    buttons: `<a class="btn btn-red" href="${u("educacion/")}">Educación</a><a class="btn btn-light" href="${u("tecnologia/")}">Tecnología</a>`,
  })}`,
});

// ---------- Contacto ----------
page({
  route: "contacto/",
  section: "contacto",
  title: "Contacto",
  desc: "Contacta a Compusis de Colombia: sedes en Bogotá, Ibagué y Girardot, teléfonos y WhatsApp.",
  crumbs: [["Inicio", ""], ["Contacto", "contacto/"]],
  body: (u, p) => `${pageHead(p, u, {
    title: "Contacto",
    lead: "Cuéntanos qué necesitas. Te respondemos con información de cursos u opciones de equipos y una cotización.",
  })}

    <section class="section contact">
      <div class="wrap contact-grid">
        <div>
          <h2 class="contact-sub">Estamos cerca de ti</h2>${sedesBlock()}
          <ul class="contact-list">
            <li><span>Teléfonos</span> <span>${SITIO.telefonos.map((t) => `<a href="tel:+57${t.replace(/\s/g, "")}">${t}</a>`).join(" · ")}</span></li>
            <li><span>Correo</span> <a href="mailto:${SITIO.correo}">${SITIO.correo}</a></li>
            <li><span>Estudiantes</span> <a href="${esc(SITIO.plataforma)}" target="_blank" rel="noopener">Plataforma académica</a></li>
          </ul>
        </div>${contactForm(u)}
      </div>
    </section>`,
});

// ---------- Política de datos ----------
page({
  route: "privacidad/",
  section: "",
  title: "Política de tratamiento de datos personales",
  desc: "Política de tratamiento de datos personales (habeas data) de Compusis de Colombia, conforme a la Ley 1581 de 2012.",
  crumbs: [["Inicio", ""], ["Política de tratamiento de datos", "privacidad/"]],
  body: (u, p) => `${pageHead(p, u, { title: "Política de tratamiento de datos personales", lead: "Última actualización: noviembre de 2026" })}
    <section class="section">
      <div class="wrap legal">${fs.readFileSync(path.join(ROOT, "privacidad.contenido.html"), "utf8")}
      </div>
    </section>`,
});

// ---------- Plantilla de página ----------
function render(p) {
  const u = p.base ? (to = "") => to || "./" : urlHelper(p.route);
  const canonical = SITIO.BASE_URL + p.route;
  const title = p.fullTitle ? p.title : `${p.title} | Compusis de Colombia`;
  const ld = [p.jsonld, p.crumbs && {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: p.crumbs.map(([name, route], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITIO.BASE_URL + route })),
  }].filter(Boolean);
  return `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; frame-src 'none'; base-uri 'self'; form-action 'none'; upgrade-insecure-requests">
  <meta name="referrer" content="strict-origin-when-cross-origin">
  ${p.base ? `<base href="${new URL(SITIO.BASE_URL).pathname}">` : ""}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(p.desc)}">
  ${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canonical}">`}
  <meta name="theme-color" content="#2b366d">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_CO">
  <meta property="og:site_name" content="Compusis de Colombia">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(p.desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITIO.BASE_URL}${p.image || "assets/og.jpg"}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${u("assets/logo.png")}">
  <link rel="preload" href="${u("assets/fuentes/archivo-latin.woff2")}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${u("styles.css")}">${ld.map((d) => `
  <script type="application/ld+json">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`).join("")}
</head>
<body${p.bodyAttr || ""}>
  <a class="skip" href="#contenido">Saltar al contenido</a>
${header(p, u)}

  <main id="contenido">${p.body(u, p)}
  </main>
${footer(u)}

  <script src="${u("app.js")}"></script>
</body>
</html>
`;
}

// Página 404 (GitHub Pages la sirve para cualquier ruta inexistente)
page({
  route: "404.html",
  file: true,
  base: true,
  noindex: true,
  section: "",
  title: "Página no encontrada",
  desc: "La página que buscas no existe o cambió de dirección.",
  body: (u) => `
    <section class="page-head">
      <div class="wrap">
        <p class="eyebrow">Error 404</p>
        <h1>No encontramos esta página</h1>
        <p class="page-lead">Es posible que la dirección haya cambiado. Estas secciones te pueden servir:</p>
        <div class="btn-row">
          <a class="btn btn-red" href="${u("educacion/")}">Educación</a>
          <a class="btn btn-navy" href="${u("tecnologia/")}">Tecnología</a>
          <a class="btn btn-ghost" href="${u()}">Ir al inicio</a>
        </div>
      </div>
    </section>`,
});

// Redirecciones de direcciones antiguas (sitio anterior en compusis.edu.co y versión de una sola página)
const REDIRECTS = {
  "privacidad.html": "privacidad/",
  "Técnicos-laborales/": "educacion/tecnicos/",
  "Programas/": "educacion/tecnicos/",
  "Técnico-en-Administración/": "educacion/tecnicos/",
  "Técnico-en-Diseño/": "educacion/tecnicos/",
  "Técnico-en-Mantenimiento/": "educacion/tecnicos/",
  "Técnico-en-Sistemas/": "educacion/tecnicos/",
  "Técnico-en-contabilidad/": "educacion/tecnicos/",
  "Cursos-libres/": "educacion/cursos/",
  "Educación-continua/": "educacion/cursos/",
  "Formación-a-la-medida/": "educacion/empresas/",
  "Inscrpciones/": "educacion/",
  "Institución/": "nosotros/",
  "Sedes/": "contacto/",
  "Sede-Bogotá-1/": "contacto/",
  "Sede-Ibagué/": "contacto/",
  "Sede-Girardot/": "contacto/",
  "Contáctanos/": "contacto/",
};

function redirectPage(from, to) {
  const depth = from.endsWith("/") ? from.split("/").filter(Boolean).length : from.split("/").length - 1;
  const target = "../".repeat(depth) + to;
  return `<!doctype html>
<html lang="es-CO">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <meta http-equiv="refresh" content="0; url=${target}">
  <link rel="canonical" href="${SITIO.BASE_URL}${to}">
  <title>Compusis de Colombia</title>
</head>
<body>
  <p>Esta página cambió de dirección: <a href="${target}">continuar</a>.</p>
</body>
</html>
`;
}

// ---------- Escritura ----------
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

for (const p of pages) write(p.file ? p.route : `${p.route}index.html`, render(p));
for (const [from, to] of Object.entries(REDIRECTS)) write(from.endsWith("/") ? `${from}index.html` : from, redirectPage(from, to));

fs.cpSync(path.join(ROOT, "assets"), path.join(OUT, "assets"), { recursive: true, filter: (src) => !src.endsWith(".gitkeep") && !src.endsWith(".DS_Store") });
for (const f of ["styles.css", "app.js"]) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
write(".nojekyll", "");
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITIO.BASE_URL}sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.filter((p) => !p.noindex).map((p) => `  <url><loc>${SITIO.BASE_URL}${p.route}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`);

console.log(`Sitio generado en _site/: ${pages.length} páginas, ${Object.keys(REDIRECTS).length} redirecciones.`);
