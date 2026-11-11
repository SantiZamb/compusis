// Cursos cortos.
// Para agregar un curso, copie un bloque y cambie sus datos:
//   slug         identificador para la dirección web, sin espacios ni tildes (educacion/cursos/<slug>/)
//   name         nombre del curso
//   area         área de formación (se usa en los filtros)
//   modalidades  "presencial" y/o "virtual" (se usa en los filtros)
//   meta         línea corta bajo el nombre
//   teaser       frase corta para la tarjeta del listado
//   desc         descripción completa (solo se muestra en la ficha del curso)
//   info         datos del curso [nombre, valor]
//   temas        lista de "¿Qué aprenderás?"
//   destacado    true para mostrarlo en la página de inicio (máximo 3 entre cursos y técnicos)

const CURSOS = [
  {
    slug: "excel-basico",
    name: "Excel Básico",
    area: "Ofimática y análisis de datos",
    modalidades: ["presencial"],
    meta: "Presencial · 5 semanas · Horario a tu elección",
    teaser: "Organiza información, haz cálculos y crea gráficos.",
    desc: "Aprende a organizar información, realizar cálculos, aplicar formatos y crear gráficos en Excel. Desarrolla habilidades esenciales para trabajar con hojas de cálculo de manera práctica y eficiente.",
    info: [["Modalidad", "Presencial"], ["Duración", "5 semanas"], ["Horario", "Lo eliges tú"], ["Metodología", "100% práctica"]],
    temas: [
      "Área de trabajo y manejo de información.",
      "Cálculos, fórmulas iniciales y referencias.",
      "Formatos para presentar tus datos.",
      "Tablas y gráficos.",
    ],
    destacado: false,
  },
  {
    slug: "excel-intermedio",
    name: "Excel Intermedio",
    area: "Ofimática y análisis de datos",
    modalidades: ["presencial"],
    meta: "Presencial · 5 semanas · Horario a tu elección",
    teaser: "Fórmulas, bases de datos y automatización de tareas.",
    desc: "Optimiza tu trabajo con fórmulas, funciones, manejo de bases de datos y automatización de tareas. Fortalece tus conocimientos y aprovecha las herramientas de Excel para trabajar con mayor productividad.",
    info: [["Modalidad", "Presencial"], ["Duración", "5 semanas"], ["Horario", "Lo eliges tú"], ["Metodología", "100% práctica"]],
    temas: [
      "Fórmulas y funciones.",
      "Manejo de bases de datos y plantillas.",
      "Tablas y gráficos dinámicos.",
      "Automatización de tareas con macros.",
    ],
    destacado: false,
  },
  {
    slug: "excel-avanzado-con-inteligencia-artificial",
    name: "Excel Avanzado con Inteligencia Artificial",
    area: "Ofimática y análisis de datos",
    modalidades: ["presencial"],
    meta: "Presencial · 5 semanas · Horario a tu elección",
    teaser: "Power Query, Power BI, dashboards e inteligencia artificial.",
    desc: "Lleva el análisis de datos a otro nivel. Aprende a utilizar funciones avanzadas, Power Query, Power BI, dashboards y herramientas de inteligencia artificial para optimizar procesos y generar información útil para la toma de decisiones.",
    info: [["Modalidad", "Presencial"], ["Duración", "5 semanas"], ["Horario", "Lo eliges tú"], ["Metodología", "100% práctica"]],
    temas: [
      "Manejo e interpretación de datos.",
      "Funciones avanzadas de Excel.",
      "Análisis de información.",
      "Introducción a Power BI y Power Query.",
      "Creación de dashboards.",
      "Automatización de archivos y uso de IA.",
    ],
    destacado: true,
  },
  {
    slug: "sistemas-basicos",
    name: "Sistemas Básicos",
    area: "Ofimática y análisis de datos",
    modalidades: ["presencial"],
    meta: "Presencial · 2 meses · 3 días por semana",
    teaser: "Computador, Office, internet e IA desde cero.",
    desc: "Desarrolla tus habilidades digitales desde cero. Aprende a manejar el computador, Word, Excel, PowerPoint, internet, correo electrónico y herramientas de inteligencia artificial para desenvolverte con confianza en entornos personales y laborales.",
    info: [["Modalidad", "Presencial"], ["Duración", "2 meses, 3 días por semana"], ["Metodología", "100% práctica"]],
    temas: [
      "Manejo del computador y del sistema operativo.",
      "Word, Excel y PowerPoint.",
      "Internet y correo electrónico.",
      "Herramientas de inteligencia artificial.",
    ],
    destacado: false,
  },
  {
    slug: "nomina-y-prestaciones-sociales",
    name: "Nómina y Prestaciones Sociales",
    area: "Contabilidad y nómina",
    modalidades: ["virtual", "presencial"],
    meta: "Virtual o presencial · 5 semanas · 3 días por semana",
    teaser: "Nómina, seguridad social y liquidaciones paso a paso.",
    desc: "Fortalece tus conocimientos en gestión de nómina, salarios, deducciones, seguridad social y prestaciones sociales. Aprende a realizar cálculos y liquidaciones mediante ejercicios prácticos aplicables al entorno empresarial.",
    info: [["Modalidad", "Virtual o presencial"], ["Duración", "5 semanas, 3 días por semana"], ["Metodología", "100% práctica"]],
    temas: [
      "Gestión de nómina y salarios.",
      "Deducciones y seguridad social.",
      "Prestaciones sociales.",
      "Cálculos y liquidaciones con ejercicios prácticos.",
    ],
    destacado: false,
  },
  {
    slug: "marketing-digital-y-ultimas-tendencias",
    name: "Marketing Digital y Últimas Tendencias",
    area: "Marketing digital",
    modalidades: ["virtual", "presencial"],
    meta: "Virtual o presencial · 5 semanas · 3 días por semana",
    teaser: "Estrategia, redes sociales, contenido y campañas.",
    desc: "Aprende a desarrollar estrategias digitales, gestionar redes sociales, crear contenido y analizar campañas publicitarias. Conoce herramientas y tendencias que te ayudarán a fortalecer la presencia digital de marcas y negocios.",
    info: [["Modalidad", "Virtual o presencial"], ["Duración", "5 semanas, 3 días por semana"], ["Metodología", "100% práctica"]],
    temas: [
      "Estrategias digitales.",
      "Gestión de redes sociales.",
      "Creación de contenido.",
      "Análisis de campañas publicitarias.",
      "Herramientas y tendencias digitales.",
    ],
    destacado: true,
  },
];
