import { GoogleGenAI } from "@google/genai";
import { NICHE_DATA } from '../constants.js';

const getAiInstance = (apiKey) => {
    if (!apiKey) {
        throw new Error("API Key no proporcionada.");
    }
    return new GoogleGenAI({ apiKey });
};

const postsSchema = {
    type: "OBJECT",
    properties: {
        posts: {
            type: "ARRAY",
            description: "Una lista de los textos generados para las publicaciones en redes sociales.",
            items: {
                type: "STRING",
                description: "El texto de una sola publicación."
            }
        }
    },
    required: ["posts"]
};

export const generatePostTextsWithAI = async (mode, config, apiKey) => {
    const ai = getAiInstance(apiKey);
    const { contentType, tone, reaction, length, quantity, topic, niche, subniche, trendTopic, trendDateFilter } = config;

    const personaInstruction = "Actúa como un copywriter profesional experto en contenido viral para redes sociales. Usa siempre un lenguaje natural, coloquial, similar al español que se habla en México. Evita palabras demasiado formales o rebuscadas.";

    const lengthMap = {
        'muy corto': '12 palabras',
        'corto': '20 palabras',
        'medio': '35 palabras'
    };
    const lengthInstruction = lengthMap[length];

    let basePrompt = `Tu rol es: ${personaInstruction}. Tu misión es crear ${quantity} frases virales para redes sociales.`;
    
    let prompt;
    let apiConfig;

    if (mode === 'ai-topic') {
        let topicInstruction;
        if (topic) {
            topicInstruction = `El tema principal es: "${topic}".`;
        } else if (niche && subniche) {
            const nicheData = NICHE_DATA.find(n => n.niche === niche);
            const subnicheData = nicheData?.subniches.find(s => s.name === subniche);
            const microtemasExample = subnicheData?.microtemas.slice(0, 3).join(', ');

            topicInstruction = `El tema principal debe estar estrictamente relacionado con el nicho "${niche}" y el subnicho "${subniche}". Debes generar frases que encajen perfectamente en esta categoría. Para darte una idea, algunos microtemas de este subnicho son: ${microtemasExample}. Puedes inventar ideas nuevas, pero siempre manteniéndote dentro del subnicho.`;
        } else {
            topicInstruction = `Cada frase debe ser sobre un tema completamente diferente y sin relación con las otras. Debes inventar los temas para cada frase. Asegúrate de que haya una gran diversidad. Por ejemplo, una frase puede ser sobre el desamor, otra sobre el trabajo, otra sobre una situación cómica del día a día, etc. La clave es la máxima variedad posible entre las frases.`;
        }

        prompt = `${basePrompt}

${topicInstruction}

Reglas estrictas:
- Formato: Las frases deben ser cortas, naturales, con estilo humano, como las que se usan en imágenes o memes.
- Longitud: Máximo ${lengthInstruction} por frase.
- Tono: El tono debe ser ${tone}.
- Objetivo Principal: Las frases deben generar ${reaction}.
- No incluyas hashtags, números de lista, ni comillas alrededor de cada frase.

El resultado debe ser un objeto JSON que siga el esquema proporcionado, sin explicaciones adicionales.`;

        apiConfig = { responseMimeType: "application/json", responseSchema: postsSchema };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: apiConfig
        });
        const parsedJson = JSON.parse(response.text.trim());
        if (parsedJson.posts && parsedJson.posts.length > 0) {
            return parsedJson.posts;
        } else {
            throw new Error("La IA no devolvió ninguna publicación.");
        }

    } else if (mode === 'ai-trend') {
        let dateInstruction = '';
        switch(trendDateFilter) {
            case 'hour': dateInstruction = ' que ocurrieron en la última hora'; break;
            case '4hours': dateInstruction = ' que ocurrieron en las últimas 4 horas'; break;
            case '24hours': dateInstruction = ' que ocurrieron en las últimas 24 horas'; break;
            case '48hours': dateInstruction = ' que ocurrieron en las últimas 48 horas'; break;
            case '7days': dateInstruction = ' que ocurrieron en los últimos 7 días'; break;
            default: dateInstruction = ''; break;
        }

        const searchInstruction = trendTopic
            ? `relacionadas con el siguiente tema: "${trendTopic}"`
            : `generales y más virales del momento`;

        prompt = `${basePrompt}

Paso 1: Investigación.
Primero, realiza una búsqueda en Google sobre las últimas noticias, conversaciones y tendencias ${searchInstruction}${dateInstruction}.

Paso 2: Generación.
Basándote en los resultados más relevantes y recientes de tu búsqueda, genera ${quantity} frases que cumplan con estos requisitos:
- Formato: Las frases deben ser cortas, naturales, con estilo humano, como las que se usan en imágenes o memes.
- Longitud: Máximo ${lengthInstruction} por frase.
- Tono: El tono debe ser ${tone}.
- Objetivo Principal: Las frases deben generar ${reaction}.
- No incluyas hashtags, números de lista, ni comillas alrededor de cada frase.

Paso 3: Formato de Salida Obligatorio.
Devuelve tu respuesta como un único objeto JSON válido, sin formato Markdown (sin \`\`\`json). El objeto debe tener una sola clave "posts", que es un array de strings, donde cada string es una de las frases generadas. Ejemplo: {"posts": ["frase 1", "frase 2"]}`;
        
        apiConfig = { tools: [{ googleSearch: {} }] };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: apiConfig
        });

        let jsonString = response.text.trim();
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.substring(7, jsonString.length - 3).trim();
        } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.substring(3, jsonString.length - 3).trim();
        }

        try {
            const parsedJson = JSON.parse(jsonString);
            if (parsedJson.posts && Array.isArray(parsedJson.posts)) {
                return parsedJson.posts;
            }
        } catch (e) {
            console.error("Error al parsear la respuesta JSON de la búsqueda de tendencias:", e, "Respuesta recibida:", jsonString);
            const lines = jsonString.split('\n').filter(line => line.trim() && !line.includes('{') && !line.includes('}'));
            if (lines.length > 0) return lines;
            throw new Error("La respuesta de la IA sobre tendencias no pudo ser procesada.");
        }
        throw new Error("La IA no devolvió ninguna publicación en el formato esperado.");
    } else {
        throw new Error("Modo de generación AI no reconocido.");
    }
};

export const findImageForPost = async (postText, apiKey) => {
    const ai = getAiInstance(apiKey);

    const prompt = `**ROL:** Eres un asistente de búsqueda visual experto en generar URLs de búsqueda para Pinterest.

**TEXTO A ANALIZAR:** "${postText}"

**TAREA:**
1.  Lee y comprende la idea principal del texto.
2.  Extrae de 2 a 4 palabras clave concisas y efectivas que representen visualmente el texto.
3.  **Añade siempre la palabra "meme" al final de las palabras clave.** Por ejemplo, si las palabras clave extraídas son "viernes celebracion", el resultado final debe ser "viernes celebracion meme".
4.  Codifica esas palabras clave para que sean seguras para una URL (reemplaza espacios con %20 o +).
5.  Construye UNA ÚNICA URL de búsqueda de Pinterest usando el siguiente formato exacto: \`https://www.pinterest.com/search/pins/?q=TUS_PALABRAS_CLAVE_CODIFICADAS&rs=typed\`
6.  Crea un título descriptivo para el enlace, como por ejemplo "Buscar '[Tus Palabras Clave]' en Pinterest".
7.  Formatea tu respuesta final como un objeto JSON.

**REGLAS DE FORMATO DE SALIDA (MUY IMPORTANTE):**
- Tu respuesta DEBE ser únicamente un objeto JSON válido, sin texto adicional, explicaciones ni formato Markdown (\`\`\`json).
- El JSON debe tener una clave principal llamada \`imageSources\`.
- El valor de \`imageSources\` debe ser un array que contenga UN ÚNICO objeto.
- Ese objeto debe tener dos claves: \`pageUrl\` (la URL de búsqueda de Pinterest que construiste) y \`title\` (el título descriptivo que creaste).

**REGLAS DE CONTENIDO (CRÍTICO):**
- **SÓLO URL DE BÚSQUEDA:** La \`pageUrl\` DEBE ser una URL de búsqueda de Pinterest (\`https://www.pinterest.com/search/pins/...\`) y NADA MÁS.
- **PROHIBIDO:** NO incluyas URLs de pines individuales (ej: \`pinterest.com/pin/...\`).

**Ejemplo de salida JSON válida para el texto "extraño a mi ex pero mi orgullo es más grande":**
{
  "imageSources": [
    {
      "pageUrl": "https://www.pinterest.com/search/pins/?q=extra%C3%B1o%20a%20mi%20ex%20meme&rs=typed",
      "title": "Buscar 'extraño a mi ex meme' en Pinterest"
    }
  ]
}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    let jsonString = response.text.trim();
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }

    try {
        const parsedJson = JSON.parse(jsonString);
        if (parsedJson.imageSources && Array.isArray(parsedJson.imageSources)) {
            return parsedJson.imageSources;
        } else {
             throw new Error("La IA no devolvió la estructura JSON esperada para las fuentes de imagen.");
        }
    } catch (e) {
        console.error("Error al parsear la respuesta JSON de la búsqueda de imagen:", e, "Respuesta recibida:", jsonString);
        throw new Error("La respuesta de la IA para la imagen no pudo ser procesada. Intenta de nuevo.");
    }
};