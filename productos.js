// Catálogo de productos.
// Para agregar un producto, copie un bloque y cambie sus datos:
//   id          identificador único, sin espacios ni tildes (se usa en "sugeridos")
//   name        nombre que se muestra
//   cats        categorías: pos, lectores, recibos, etiquetas, carnets, suministros
//   desc        descripción corta (opcional)
//   img         nombre del archivo en assets/productos/, sin extensión (.webp)
//   warranty    texto de garantía, o null
//   specs       hasta 3 características principales [nombre, valor]
//   ficha       nombre del PDF en assets/fichas/, o null si aún no está
//   sugeridos   ids de productos que suelen comprarse junto con este

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
    id: "cajon-sat-119x",
    name: "Cajón monedero SAT 119X negro",
    cats: ["pos"],
    desc: "",
    img: "cajon-sat-119x",
    warranty: "1 año de garantía",
    specs: [["Medidas", "410 × 420 × 100 mm"], ["Compartimentos", "8 monedas, 5 billetes"], ["Conexión", "RJ11"]],
    ficha: null,
    sugeridos: ["impresora-q38t", "impresora-q23t", "lector-sat-ld101r"],
  },
  {
    id: "lector-sat-ld101r",
    name: "Lector de código de barras SAT LD101R+1",
    cats: ["lectores", "pos"],
    desc: "",
    img: "lector-sat-ld101r",
    warranty: "1 año de garantía",
    specs: [["Tecnología", "Láser lineal"], ["Velocidad", "300 lecturas/s"], ["Códigos", "1D"]],
    ficha: null,
    sugeridos: ["cajon-sat-119x", "impresora-q23t"],
  },
  {
    id: "lector-ds2208",
    name: "Lector de código de barras Zebra DS2208",
    cats: ["lectores", "pos"],
    desc: "",
    img: "lector-ds2208",
    warranty: "1 año de garantía",
    specs: [["Tecnología", "Imager"], ["Rango (UPC 13 mil)", "1,23 a 36,8 cm"], ["Códigos", "1D y 2D"]],
    ficha: null,
    sugeridos: ["impresora-q38t", "impresora-dtl58"],
  },
  {
    id: "impresora-q38t",
    name: "Impresora térmica SAT Q38T USEBW",
    cats: ["recibos", "pos"],
    desc: "",
    img: "impresora-q38t",
    warranty: "1 año de garantía",
    specs: [["Resolución", "203 dpi"], ["Velocidad", "300 mm/s"], ["Ancho de papel", "58 a 80 mm"]],
    ficha: null,
    sugeridos: ["rollo-termico-80x60", "cajon-sat-119x", "lector-ds2208"],
  },
  {
    id: "impresora-q23t",
    name: "Impresora térmica SAT Q23T",
    cats: ["recibos", "pos"],
    desc: "",
    img: "impresora-q23t",
    warranty: "1 año de garantía",
    specs: [["Resolución", "203 dpi"], ["Velocidad", "230 mm/s"], ["Ancho de papel", "80 mm"]],
    ficha: null,
    sugeridos: ["rollo-termico-80x60", "cajon-sat-119x", "lector-sat-ld101r"],
  },
  {
    id: "impresora-dtl58",
    name: "Impresora de etiquetas y recibos SAT DTL58 UE",
    cats: ["etiquetas", "recibos"],
    desc: "",
    img: "impresora-dtl58",
    warranty: "1 año de garantía",
    specs: [["Resolución", "203 dpi"], ["Rollo", "70 mm u 80 mm"], ["Códigos", "1D y 2D"]],
    ficha: null,
    sugeridos: ["lector-ds2208", "lector-sat-ld101r"],
  },
  {
    id: "impresora-tt448",
    name: "Impresora de etiquetas SAT TT448-2",
    cats: ["etiquetas"],
    desc: "",
    img: "impresora-tt448",
    warranty: "1 año de garantía",
    specs: [["Resolución", "203 dpi"], ["Ancho de impresión", "104 mm"], ["Lenguajes", "ZPL, TSPL, EPL"]],
    ficha: null,
    sugeridos: ["lector-ds2208"],
  },
  {
    id: "impresora-xt46",
    name: "Impresora de etiquetas industrial SAT XT46",
    cats: ["etiquetas"],
    desc: "",
    img: "impresora-xt46",
    warranty: "2 años de garantía",
    specs: [["Resolución", "203 dpi"], ["Ancho de impresión", "104 mm"], ["Lenguajes", "DPL, ZPL-II, TSPL"]],
    ficha: null,
    sugeridos: ["lector-ds2208"],
  },
  {
    id: "impresora-carnets-zc",
    name: "Impresoras de carnets Zebra ZC100 / ZC300",
    cats: ["carnets"],
    desc: "Incluye impresora, 200 carnets PVC, cinta de 200 imágenes y software CardStudio Standard.",
    img: "impresora-carnets-zc",
    warranty: "3 años de garantía",
    specs: [["Resolución", "300 dpi"], ["Compatibilidad", "Windows, Linux, Apple"]],
    ficha: null,
    sugeridos: [],
  },
  {
    id: "rollo-termico-80x60",
    name: "Rollo térmico SAT 80 mm × 60 m, 48 g",
    cats: ["suministros"],
    desc: "Para impresoras POS de alta demanda. Compatible con impresoras de diversas marcas.",
    img: "rollo-termico-80x60",
    warranty: null,
    specs: [["Medidas", "80 mm × 60 m"], ["Gramaje", "48 g/m²"]],
    ficha: null,
    sugeridos: ["impresora-q38t", "impresora-q23t"],
  },
];
