export const DEFAULT_PREVIEW_DATA = {
    profilePic: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNDQ0NDQ0MiLz48L3N2Zz4=',
    name: 'usuario',
    username: '@usuario',
    verificationType: 'none',
    font: 'Inter',
    alignment: 'left',
    text: 'Este es un texto de ejemplo para la vista previa de la publicación. Puedes editarlo para ver cómo se ve.',
    customBackgroundUrl: '',
    backgroundTextPosition: {
        x: 50,
        y: 50,
    },
};

export const DEFAULT_AI_CONFIG = {
    contentType: 'meme',
    tone: 'sarcastic_humorous',
    reaction: 'risa e identificación',
    length: 'medio',
    quantity: 5,
    topic: '',
    trendTopic: '',
    trendDateFilter: 'any',
    niche: '',
    subniche: '',
};

export const CONTENT_STRATEGY_MAP = {
    'meme': { tone: 'sarcastic_humorous', reaction: 'risa e identificación', tooltip: 'Ideal para viralidad y humor rápido. Busca que la gente se ría y etiquete a sus amigos.' },
    'frase_opinion': { tone: 'emotional_reflective', reaction: 'reflexión profunda', tooltip: 'Busca generar conexión emocional o una reflexión breve. Ideal para guardados y comentarios de acuerdo/desacuerdo.' },
    'debate': { tone: 'polemic_opinative', reaction: 'polémica y debate', tooltip: 'Perfecto para generar comentarios masivos y opiniones divididas. Usa un tono fuerte y directo.' },
    'debatible': { tone: 'ironic_critical', reaction: 'comentarios y participación', tooltip: 'Genera interacción sin tanto conflicto. Invita a la gente a dar su punto de vista sobre una idea.' },
    'emocional': { tone: 'dramatic_emotional', reaction: 'emoción y empatía', tooltip: 'Conecta con los sentimientos del público. Busca que comenten "me pasó" o "justo lo que necesitaba leer".' },
    'mananera': { tone: 'motivacional', reaction: 'inspiración y motivación', tooltip: 'Para empezar el día con energía positiva. Busca likes y comentarios de "buenos días".' },
    'reflexion': { tone: 'emotional_reflective', reaction: 'reflexión profunda', tooltip: 'Para cerrar el día con una idea profunda. Fomenta que se guarde y se comparta con alguien especial.' },
    'final': { tone: 'inspiring_reflective', reaction: 'inspiración y motivación', tooltip: 'Ofrece un cierre positivo o inspirador. Ideal para generar lealtad y comentarios de agradecimiento.' },
    'cristiana': { tone: 'emocional', reaction: 'fe y agradecimiento', tooltip: 'Conecta a un nivel espiritual. Busca comentarios como "Amén" y que se comparta en grupos de fe.' },
    'manipuladora': { tone: 'sugerente_psicologico', reaction: 'compartidos masivos', tooltip: 'Usa un gancho psicológico para alta retención. Frases como "Si lees esto, es una señal..."' }
};

export const TONES = [
    // Combinados Populares
    { value: 'sarcastic_humorous', label: 'Sarcástico / Humorístico' },
    { value: 'emotional_reflective', label: 'Emocional / Reflexivo' },
    { value: 'polemic_opinative', label: 'Polémico / Opinativo' },
    { value: 'ironic_critical', label: 'Irónico / Crítico' },
    { value: 'dramatic_emotional', label: 'Dramático / Emocional' },
    { value: 'inspiring_reflective', label: 'Inspirador / Reflexivo' },
    { value: 'pícaro_doble_sentido', label: 'Pícaro / Doble Sentido' },
    { value: 'confesional_intimo', label: 'Confesional / Íntimo' },
    { value: 'agresivo_directo', label: 'Agresivo / Directo' },
    { value: 'curioso_sorprendente', label: 'Curioso / Sorprendente' },
    { value: 'informativo_educativo', label: 'Informativo / Educativo' },
    { value: 'sugestivo_motivacional', label: 'Sugestivo / Motivacional' },
    { value: 'misterioso_inspirador', label: 'Misterioso / Inspirador' },
    { value: 'cinico_humoristico', label: 'Cínico / Humorístico' },

    // Tonos Puros
    { value: 'humoristico', label: 'Humorístico (Puro)' },
    { value: 'sarcástico', label: 'Sarcástico (Puro)' },
    { value: 'irónico', label: 'Irónico (Puro)' },
    { value: 'crítico', label: 'Crítico (Puro)' },
    { value: 'emocional', label: 'Emocional (Puro)' },
    { value: 'reflexivo', label: 'Reflexivo (Puro)' },
    { value: 'inspirador', label: 'Inspirador (Puro)' },
    { value: 'motivacional', label: 'Motivacional (Puro)' },
    { value: 'polémico', label: 'Polémico (Puro)' },
    { value: 'opinativo', label: 'Opinativo (Puro)' },
    { value: 'dramático', label: 'Dramático (Puro)' },
    { value: 'sugerente_psicologico', label: 'Sugerente / Psicológico' },
    { value: 'espiritual_mistico', label: 'Espiritual / Místico' },
    { value: 'nostalgico', label: 'Nostálgico' },
    { value: 'tierno_adorable', label: 'Tierno / Adorable' },
    { value: 'humor_negro', label: 'Humor Negro' },
    { value: 'rebelde', label: 'Rebelde' },
    { value: 'romantico', label: 'Romántico' },
    { value: 'existencial', label: 'Existencial' },
];

export const REACTIONS = [
    { value: 'risa e identificación', label: 'Risa e Identificación' },
    { value: 'reflexión profunda', label: 'Reflexión Profunda' },
    { value: 'polémica y debate', label: 'Polémica y Debate' },
    { value: 'comentarios y participación', label: 'Comentarios y Participación' },
    { value: 'emoción y empatía', label: 'Emoción y Empatía' },
    { value: 'inspiración y motivación', label: 'Inspiración y Motivación' },
    { value: 'fe y agradecimiento', label: 'Fe y Agradecimiento' },
    { value: 'compartidos masivos', label: 'Compartidos Masivos' },
    { value: 'guardados', label: 'Guardados (Contenido de Valor)' },
    { value: 'curiosidad y sorpresa', label: 'Curiosidad y Sorpresa' },
];


export const NICHE_DATA = [
    { niche: "Humor y Entretenimiento", subniches: [
        { name: "Humor cotidiano", microtemas: ["vida diaria", "tráfico", "familia", "suegros", "memes de WhatsApp", "conversaciones graciosas"] },
        { name: "Humor de pareja", microtemas: ["celos", "vida en pareja", "conversaciones graciosas", "expectativa vs realidad"] },
        { name: "Humor laboral", microtemas: ["jefes tóxicos", "compañeros de trabajo", "reuniones inútiles", "lunes por la mañana"] },
        { name: "Humor escolar", microtemas: ["tareas", "maestros", "exámenes"] },
        { name: "Humor negro / sarcástico", microtemas: ["sarcasmo", "ironía", "humor ácido", "crítica social"] },
        { name: "Humor de situaciones absurdas", microtemas: ["cosas sin sentido", "mala suerte", "momentos incómodos"] }
    ]},
    { niche: "Drama y Confesiones", subniches: [
        { name: "Confesiones anónimas", microtemas: ["infidelidad", "secretos", "arrepentimiento", "venganza", "traición"] },
        { name: "Historias reales impactantes", microtemas: ["superación", "karma", "lecciones de vida", "abandono"] },
        { name: "Problemas de pareja", microtemas: ["discusiones", "ruptura", "celos", "traición", "reconciliación"] },
        { name: "Reflexiones personales", microtemas: ["soledad", "cambio de vida", "superación", "errores del pasado", "arrepentimiento"] },
        { name: "Secretos familiares", microtemas: ["herencias", "conflictos familiares", "revelaciones", "traición familiar"] }
    ]},
    { niche: "Relación y Pareja", subniches: [
        { name: "Amor y desamor", microtemas: ["indirectas de amor", "extrañar a alguien", "nuevo amor", "corazón roto", "crush"] },
        { name: "Relaciones tóxicas", microtemas: ["manipulación", "banderas rojas", "amor propio", "dejar ir", "celos"] },
        { name: "Rupturas y reconciliaciones", microtemas: ["ex parejas", "relaciones fallidas", "volver con tu ex", "superar una ruptura"] },
        { name: "Humor romántico", microtemas: ["cosas de novios", "citas graciosas", "ligar", "coqueteo", "WhatsApp"] },
        { name: "Frases de amor / indirectas", microtemas: ["indirectas amorosas", "frases para dedicar", "poesía", "amor a distancia"] }
    ]},
    { niche: "Motivación y Superación", subniches: [
        { name: "Frases motivacionales", microtemas: ["metas", "sueños", "nunca rendirse", "éxito", "disciplina", "caídas"] },
        { name: "Historias inspiradoras", microtemas: ["superación personal", "casos de éxito", "cambio de vida", "resiliencia"] },
        { name: "Desarrollo personal", microtemas: ["autoestima", "resiliencia", "crecimiento personal", "nuevos hábitos", "errores"] },
        { name: "Emprendimiento emocional", microtemas: ["miedo al fracaso", "mentalidad de emprendedor", "logros", "inspiración"] }
    ]},
    { niche: "Polémica y Opinión Social", subniches: [
        { name: "Debate social / feminismo / machismo", microtemas: ["feminismo", "machismo", "igualdad", "privilegios", "roles de género"] },
        { name: "Crítica a la sociedad", microtemas: ["redes sociales", "influencers", "doble moral", "cultura moderna", "generaciones"] },
        { name: "Tópicos controversiales", microtemas: ["política ligera", "religión", "temas tabú", "cancelación"] },
        { name: "Opinión sobre noticias virales", microtemas: ["tendencias", "noticias del día", "chismes de famosos", "eventos actuales"] }
    ]},
    { niche: "Curiosidades y Datos Sorprendentes", subniches: [
        { name: "Datos curiosos del cuerpo o la mente", microtemas: ["cerebro", "sueños", "psicología", "amor", "cuerpo humano"] },
        { name: "Misterios y rarezas del mundo", microtemas: ["lugares abandonados", "casos sin resolver", "leyendas urbanas", "universo"] },
        { name: "Curiosidades históricas o culturales", microtemas: ["historia", "culturas antiguas", "inventos", "tradiciones raras"] },
        { name: "Tecnología y descubrimientos", microtemas: ["inteligencia artificial", "apps virales", "gadgets", "futuro", "ciencia curiosa", "TikTok"] }
    ]},
    { niche: "Emocional y Reflexivo", subniches: [
        { name: "Historias con moraleja", microtemas: ["lecciones de vida", "errores", "aprendizaje", "gratitud"] },
        { name: "Frases para pensar", microtemas: ["tiempo", "vida", "decisiones", "madurez", "familia", "soledad", "cambios"] },
        { name: "Reflexiones sobre la vida", microtemas: ["el paso del tiempo", "el propósito", "la felicidad", "el dolor"] },
        { name: "Historias anónimas con enseñanza", microtemas: ["superación", "perdón", "resiliencia", "amor propio"] }
    ]},
    { niche: "Sarcasmo e Ironía", subniches: [
        { name: "Frases sarcásticas", microtemas: ["trabajo", "relaciones", "vida adulta", "hipocrisía", "dinero", "redes sociales"] },
        { name: "Situaciones irónicas", microtemas: ["mala suerte", "expectativa vs realidad", "karma instantáneo"] },
        { name: "Crítica disfrazada de humor", microtemas: ["redes sociales", "política ligera", "tendencias absurdas", "amistades falsas", `"yo no pero sí"`] }
    ]},
    { niche: "Doble Sentido y Picante", subniches: [
        { name: "Humor con malicia", microtemas: ["fiesta", "ligues", "coqueteo", "indirectas picantes", "frases con malicia"] },
        { name: "Frases con doble interpretación", microtemas: ["albures ligeros", "juegos de palabras", "situaciones ambiguas"] },
        { name: "Entrevistas o situaciones picarescas", microtemas: ["reacciones", "preguntas incómodas", "momentos atrevidos"] }
    ]},
    { niche: "Cotidiano / Vida Real", subniches: [
        { name: "Vida doméstica", microtemas: ["lavar trastes", "limpieza", "cocinar", "mascotas"] },
        { name: "Trabajo", microtemas: ["jefes", "compañeros", "reuniones", "sueldos", "cansancio"] },
        { name: "Escuela", microtemas: ["tareas", "maestros", "exámenes", "clases en línea"] },
        { name: "Adulting (vida adulta)", microtemas: ["pagar cuentas", "responsabilidades", "despertarse temprano", "tráfico", "lunes", "rutinas"] }
    ]},
    { niche: "Tecnología y Actualidad", subniches: [
        { name: "IA y apps virales", microtemas: ["inteligencia artificial", "ChatGPT", "Gemini", "TikTok", "reels"] },
        { name: "Tendencias digitales", microtemas: ["nuevas redes sociales", "memes del momento", "retos virales"] },
        { name: "Tutoriales rápidos", microtemas: ["hacks tecnológicos", "trucos para celular", "herramientas útiles"] },
        { name: "Noticias tech", microtemas: ["lanzamientos", "gadgets", "innovaciones", "el futuro de la tecnología"] }
    ]},
    { niche: "Deportes y Fútbol", subniches: [
        { name: "Fútbol (principalmente)", microtemas: ["Messi", "Cristiano", "clásico", "ligas", "polémicas", "jugadas"] },
        { name: "Deportes virales", microtemas: ["momentos épicos", "fails deportivos", "nuevos deportes"] },
        { name: "Humor deportivo", microtemas: ["memes de fútbol", "reacciones de fans", "burlas entre equipos"] },
        { name: "Opiniones y debates", microtemas: ["el mejor jugador", "polémicas arbitrales", "fanatismo", "frases de fútbol"] }
    ]},
    { niche: "Espiritualidad y Energía", subniches: [
        { name: "Energías, karma, vibras", microtemas: ["energías negativas", "karma instantáneo", "buenas vibras", "destino"] },
        { name: "Ley de atracción", microtemas: ["manifestación", "decretos", "visualización", "alineación espiritual"] },
        { name: "Signos zodiacales", microtemas: ["horóscopo", "compatibilidad zodiacal", "mercurio retrógrado", "características de signos"] }
    ]},
    { niche: "Belleza y Autoestima", subniches: [
        { name: "Cuidado personal", microtemas: ["skincare", "maquillaje", "rutinas de belleza", "consejos"] },
        { name: "Autoaceptación", microtemas: ["amor propio", "aceptar tu cuerpo", "inseguridades", "comparación"] },
        { name: "Belleza emocional", microtemas: ["sentirse bien", "confianza", "glow up", "belleza interior"] },
        { name: "Frases de amor propio", microtemas: ["empoderamiento", "autoestima", "poner límites", "estilo"] }
    ]},
    { niche: "Familia y Amistad", subniches: [
        { name: "Frases familiares", microtemas: ["mamá", "papá", "hermanos", "abuelos", "familia es primero"] },
        { name: "Historias entre padres e hijos", microtemas: ["anécdotas de la infancia", "consejos familiares", "conflictos generacionales"] },
        { name: "Amistades verdaderas o falsas", microtemas: ["amigos verdaderos", "amistades tóxicas", "amigos traicioneros", "lealtad"] }
    ]},
    { niche: "Cultura Pop y Entretenimiento", subniches: [
        { name: "Series y películas", microtemas: ["Netflix", "estrenos", "personajes", "frases de películas", "telenovelas"] },
        { name: "Famosos y chismes", microtemas: ["escándalos", "nuevas parejas", "noticias de artistas", "cultura mexicana"] },
        { name: "Música y trends", microtemas: ["trends de TikTok", "artistas del momento", "conciertos", "nostalgia noventera"] }
    ]},
    { niche: "Animales y Mascotas", subniches: [
        { name: "Memes de animales", microtemas: ["perros graciosos", "gatos haciendo cosas raras", "animales inesperados"] },
        { name: "Historias tiernas o tristes", microtemas: ["rescates", "adopciones", "animales ayudando a humanos"] },
        { name: "Reacciones graciosas", microtemas: ["comportamientos curiosos", "“cuando mi perro me ignora”", "mascotas siendo dramáticas"] }
    ]},
    { niche: "Terror y Misterio", subniches: [
        { name: "Historias paranormales", microtemas: ["fantasmas", "experiencias personales", "casas embrujadas"] },
        { name: "Leyendas urbanas", microtemas: ["mitos populares", "historias de terror locales", "criaturas misteriosas"] },
        { name: "Casos inexplicables", microtemas: ["sucesos reales", "videos misteriosos", "desapariciones", "teorías de conspiración"] }
    ]},
    { niche: "Estilo de Vida / Lifestyle", subniches: [
        { name: "Vida moderna", microtemas: ["rutina diaria", "estrés", "equilibrio mental", "ansiedad social"] },
        { name: "Minimalismo", microtemas: ["vivir con menos", "orden y limpieza", "consumismo", "paz mental"] },
        { name: "Tendencias sociales", microtemas: ["nuevas modas", "viajes", "productividad", "bienestar", "redes sociales"] }
    ]},
    { niche: "Finanzas y Dinero", subniches: [
        { name: "Finanzas personales", microtemas: ["deudas", "ahorro", "inversiones para principiantes", "presupuesto"] },
        { name: "Emprendimiento digital", microtemas: ["ideas de negocio", "side hustles", "marketing digital", "trabajo remoto"] },
        { name: "Crítica al sistema económico", microtemas: ["sueldos", "comparación social", "“cómo sobrevivo con $100”", "la carrera de la rata"] }
    ]}
];
