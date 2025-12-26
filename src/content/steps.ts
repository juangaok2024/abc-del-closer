export interface Step {
  id: number;
  title: string;
  headline: string;
  content: StepContent;
  progress: number;
  quote?: string;
}

export type StepContent =
  | { type: 'intro'; subtext: string }
  | { type: 'text'; paragraphs: string[] }
  | { type: 'earnings'; model: string; example: string; ranges: { level: string; range: string }[] }
  | { type: 'skills'; skills: { title: string; points: string[] }[] }
  | { type: 'day'; timeline: { time: string; description: string }[]; notDo: string[] }
  | { type: 'howto'; paths: { name: string; steps: string }[]; requirements: string[] }
  | { type: 'cta'; paragraphs: string[]; buttonText: string; subtext: string; signature: string };

export const steps: Step[] = [
  {
    id: 0,
    title: 'Intro',
    headline: 'El trabajo remoto mejor pagado que casi nadie conoce en Latinoamérica',
    content: {
      type: 'intro',
      subtext: 'En los próximos 5 minutos vas a descubrir cómo ganar en dólares desde tu casa, sin inglés y sin título',
    },
    progress: 0,
  },
  {
    id: 1,
    title: '¿Qué es un Closer?',
    headline: '¿Qué es un Closer?',
    content: {
      type: 'text',
      paragraphs: [
        'Un Closer es la persona que cierra ventas de alto valor por teléfono o videollamada.',
        'No es vendedor tradicional que llama en frío. El Closer recibe personas que YA están interesadas.',
        'Las empresas invierten en publicidad, generan miles de interesados, pero necesitan a alguien que convierta ese interés en ventas. Ese alguien es el Closer.',
      ],
    },
    progress: 20,
    quote: 'El Closer no convence. El Closer ayuda a tomar la decisión.',
  },
  {
    id: 2,
    title: '¿Cuánto gana?',
    headline: '¿Cuánto gana un Closer?',
    content: {
      type: 'earnings',
      model: '100% comisión, típicamente 10-20% del valor de venta',
      example: 'Producto de $1,500 USD con 10% = $150 por venta',
      ranges: [
        { level: 'Principiante', range: '$800 - $1,500 USD/mes' },
        { level: 'Intermedio', range: '$2,000 - $4,000 USD/mes' },
        { level: 'Avanzado', range: '$5,000 - $10,000+ USD/mes' },
      ],
    },
    progress: 40,
    quote: 'Todo esto trabajando desde tu casa, con tu horario, cobrando en dólares',
  },
  {
    id: 3,
    title: '3 Habilidades',
    headline: 'Las 3 habilidades que necesitás',
    content: {
      type: 'skills',
      skills: [
        {
          title: 'ESCUCHA ACTIVA',
          points: [
            'El 80% de una llamada es escuchar, no hablar',
            'Tu trabajo es entender qué quiere la persona, qué la frena, qué la motiva',
          ],
        },
        {
          title: 'MANEJO DE OBJECIONES',
          points: [
            'Una objeción no es un "no", es una pregunta disfrazada',
            '"Es muy caro" = "¿Vale la pena para mí?"',
          ],
        },
        {
          title: 'CONTROL EMOCIONAL',
          points: [
            'Vas a escuchar muchos "no"',
            'El Closer profesional no se engancha emocionalmente',
          ],
        },
      ],
    },
    progress: 60,
    quote: 'Ninguna requiere talento natural. Se aprenden y se practican.',
  },
  {
    id: 4,
    title: 'Un día típico',
    headline: 'Un día en la vida de un Closer',
    content: {
      type: 'day',
      timeline: [
        { time: 'MAÑANA', description: 'Te levantás, revisás agenda. Tenés 4 llamadas programadas.' },
        { time: 'BLOQUE DE LLAMADAS', description: 'Cada llamada dura 30-60 min. Hoy cerraste 1 de 4. Normal.' },
        { time: 'RESTO DEL DÍA', description: 'Libre. El trabajo está hecho.' },
      ],
      notDo: [
        'No buscás clientes (te los dan)',
        'No hacés publicidad',
        'No cobrás ni gestionás pagos',
        'No atendés reclamos post-venta',
      ],
    },
    progress: 80,
    quote: 'Tu único trabajo es estar en la llamada y cerrar.',
  },
  {
    id: 5,
    title: 'Cómo empezar',
    headline: '¿Cómo conseguir tu primer trabajo?',
    content: {
      type: 'howto',
      paths: [
        { name: 'Camino tradicional (lento)', steps: 'YouTube → Aplicar sin experiencia → 50 rechazos → Oportunidad mala → Abandono' },
        { name: 'Camino inteligente', steps: 'Formarte → Practicar → Entrar a empresa con sistema → Generar ingresos' },
      ],
      requirements: [
        'Computadora o celular con buena conexión',
        'Lugar tranquilo para llamadas',
        '4-6 horas disponibles por día',
        'Ganas de aprender',
      ],
    },
    progress: 100,
    quote: 'No necesitás título, inglés, ni experiencia previa.',
  },
  {
    id: 6,
    title: 'Agendar',
    headline: '¿Querés saber si esto es para vos?',
    content: {
      type: 'cta',
      paragraphs: [
        'En La U del Closer formamos personas desde cero y las conectamos con empresas que necesitan Closers.',
        'Agendá una llamada de diagnóstico gratuita. 15-20 minutos donde analizamos tu situación.',
      ],
      buttonText: 'AGENDAR MI LLAMADA',
      subtext: 'Sin compromiso. Si no es para vos, te lo decimos.',
      signature: '— Tino Mossu | @tino.mossu',
    },
    progress: 100,
  },
];
