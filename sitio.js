// Datos generales del sitio: contacto, sedes, categorías de tecnología, industrias, guías y marcas.
// Al cambiar al dominio propio, actualice solo BASE_URL (debe terminar en "/").

const SITIO = {
  BASE_URL: "https://santizamb.github.io/compusis/",
  nombre: "Compusis de Colombia",
  whatsapp: "573108721135",
  telefonos: ["310 872 1135", "317 377 6690"],
  correo: "soporte@compusis.edu.co",
  plataforma: "https://site2.q10.com/login?ReturnUrl=%2F&aplentId=e5a3adba-d8db-4343-bf0a-eb21a2a2d727",
  preinscripcion: "https://site4.q10.com/preinscripcion?aplentId=e5a3adba-d8db-4343-bf0a-eb21a2a2d727",
};

const SEDES = [
  { id: "bogota", name: "Bogotá", address: "Calle 17 N.º 98-90, piso 2, Fontibón Centro, Bogotá D. C.", map: "https://www.google.com/maps/search/?api=1&query=Calle+17+%2398-90+Fontib%C3%B3n+Bogot%C3%A1" },
  { id: "ibague", name: "Ibagué", address: "Avenida Ferrocarril N.º 29-58, barrio La Francia, Ibagué, Tolima", map: "https://www.google.com/maps/search/?api=1&query=Avenida+Ferrocarril+%2329-58+La+Francia+Ibagu%C3%A9" },
  { id: "girardot", name: "Girardot", address: "Carrera 10 N.º 17-44, piso 2, Girardot, Cundinamarca", map: "https://www.google.com/maps/search/?api=1&query=Carrera+10+%2317-44+Girardot" },
];

// Grupos que se muestran en el menú Tecnología. "cats" usa las categorías de productos.js.
// Un grupo sin productos no aparece en el menú ni genera página.
const TECH_GROUPS = [
  { slug: "punto-de-venta", name: "Punto de venta", cats: ["pos"], desc: "Cajones monederos, impresoras de recibos y lectores para agilizar tus cajas." },
  { slug: "impresion-y-etiquetado", name: "Impresión y etiquetado", cats: ["recibos", "etiquetas"], desc: "Impresoras de recibos y de etiquetas, de escritorio e industriales." },
  { slug: "lectores-e-identificacion", name: "Lectores e identificación", cats: ["lectores", "carnets"], desc: "Lectores de códigos de barras e impresoras de carnets." },
  { slug: "movilidad", name: "Movilidad", cats: ["movilidad"], desc: "Terminales y equipos portátiles para trabajo en campo y bodega." },
  { slug: "computo-y-perifericos", name: "Cómputo y periféricos", cats: ["computo"], desc: "Computadores, monitores y periféricos para tu operación." },
  { slug: "seguridad", name: "Seguridad", cats: ["seguridad"], desc: "Cámaras, control de acceso y equipos de seguridad." },
  { slug: "suministros", name: "Suministros", cats: ["suministros"], desc: "Rollos térmicos, etiquetas y consumibles compatibles." },
];

const INDUSTRIAS = [
  { img: "bodega", alt: "Operarios revisando inventario en una bodega", name: "Industria y manufactura", desc: "Etiquetas industriales, trazabilidad de producción y control de inventarios." },
  { img: "tienda", alt: "Tendero en su punto de venta", name: "Comercio y retail", desc: "Cajones monederos, lectores e impresoras de recibos para cajas rápidas." },
  { img: "salud", alt: "Enfermera mostrando su carnet de identificación", name: "Salud", desc: "Carnetización de personal, identificación y etiquetado de muestras." },
  { img: "logistica", alt: "Trabajador de logística en un centro de distribución", name: "Logística y transporte", desc: "Lectura de códigos, guías de despacho y rotulado de cajas." },
];

const GUIAS = [
  { img: "guia-etiquetas", alt: "Guía rápida de etiquetas: materiales, ribbons y usos recomendados", name: "La etiqueta correcta para cada aplicación", desc: "Material, ribbon y adhesivo según superficie, temperatura y duración." },
  { img: "guia-flexografia", alt: "Guía de flexografía: colores, materiales y aplicaciones", name: "Flexografía", desc: "Etiquetas impresas a color para empaques, alimentos y productos de marca." },
];

const MARCAS = [
  ["zebra", "Zebra"], ["sat", "SAT"], ["hid", "HID"], ["zkteco", "ZKTeco"],
  ["topaz", "Topaz Systems"], ["elo", "Elo"], ["ruijie", "Ruijie Reyee"], ["imou", "Imou"],
];
