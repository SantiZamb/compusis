// Programas técnicos laborales por competencias.
// Para agregar un programa, copie un bloque y cambie sus datos:
//   slug        identificador para la dirección web, sin espacios ni tildes (educacion/tecnicos/<slug>/)
//   name        nombre oficial del programa
//   sede        "bogota", "ibague" o "girardot" (ver SEDES en sitio.js)
//   resolucion  resolución de aprobación
//   desc        descripción del programa (opcional; se muestra en la ficha)
//   info        datos adicionales [nombre, valor], por ejemplo duración o jornada (opcional)
//   destacado   true para mostrarlo en la página de inicio (máximo 3 entre cursos y técnicos)

const TECNICOS = [
  {
    slug: "auxiliar-contable-y-financiero",
    name: "Técnico Laboral en Auxiliar Contable y Financiero",
    sede: "ibague",
    resolucion: "Resolución 1700-1137 del 20 de abril de 2026",
    desc: "",
    info: [],
    destacado: true,
  },
  {
    slug: "asistente-de-sistemas-informaticos",
    name: "Técnico Laboral en Asistente de Sistemas Informáticos",
    sede: "ibague",
    resolucion: "Resolución 1700-1137 del 20 de abril de 2026",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "auxiliar-administrativo",
    name: "Técnico Laboral en Auxiliar Administrativo",
    sede: "ibague",
    resolucion: "Resolución 1700-1137 del 20 de abril de 2026",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "mercadeo-y-publicidad",
    name: "Técnico Laboral en Mercadeo y Publicidad",
    sede: "ibague",
    resolucion: "Resolución 1700-1137 del 20 de abril de 2026",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "administracion-de-redes-y-programacion-de-computadores",
    name: "Técnico Laboral por Competencias en Administración de Redes y Programación de Computadores",
    sede: "girardot",
    resolucion: "Resolución 0240 del 23 de marzo de 2021",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "gestion-empresarial-y-de-negocios",
    name: "Técnico Laboral por Competencias en Gestión Empresarial y de Negocios",
    sede: "girardot",
    resolucion: "Resolución 0238 del 23 de marzo de 2021",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "gestion-contable-sistematizada",
    name: "Técnico Laboral por Competencias en Gestión Contable Sistematizada",
    sede: "girardot",
    resolucion: "Resolución 0242 del 23 de marzo de 2021",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "diseno-grafico-publicitario-y-multimedia",
    name: "Técnico Laboral por Competencias en Diseño Gráfico Publicitario y Multimedia",
    sede: "girardot",
    resolucion: "Resolución 0241 del 23 de marzo de 2021",
    desc: "",
    info: [],
    destacado: false,
  },
  {
    slug: "mantenimiento-de-equipos-de-computo",
    name: "Técnico Laboral por Competencias en Mantenimiento de Equipos de Cómputo",
    sede: "girardot",
    resolucion: "Resolución 0239 del 23 de marzo de 2021",
    desc: "",
    info: [],
    destacado: false,
  },
];
