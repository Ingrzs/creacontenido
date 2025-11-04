// html2canvas y JSZip se cargan desde el CDN en index.html, por lo que asumimos que están disponibles globalmente en el objeto window.

// Función auxiliar para renderizar un elemento con un ancho fijo para una generación de imagen consistente.
const renderElementToCanvas = async (element) => {
    // Clona el nodo para evitar modificar el elemento original en el DOM.
    const clone = element.cloneNode(true);

    // Estiliza el clon para un renderizado fuera de pantalla con un ancho fijo que coincida con la vista previa (`max-w-md` -> 448px).
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0px';
    clone.style.width = '448px';
    clone.style.maxWidth = '448px';
    // Se asegura de que no esté restringido por el ancho de un padre si era `w-full`.
    clone.classList.remove('w-full'); 

    // Forzar estilos de ajuste de texto en el párrafo principal para asegurar la consistencia.
    // Esto es una salvaguarda contra posibles problemas de renderizado de html2canvas.
    const textParagraph = clone.querySelector('p'); // El párrafo que contiene el texto principal del post.
    if (textParagraph) {
        textParagraph.style.whiteSpace = 'pre-wrap';
        textParagraph.style.overflowWrap = 'break-word';
        textParagraph.style.wordBreak = 'break-word';
    }


    document.body.appendChild(clone);

    // Espera un breve momento. Esto es más robusto que requestAnimationFrame para asegurar
    // que el navegador complete el cálculo del layout (reflow) y el pintado (repaint),
    // especialmente con fuentes web que pueden tardar en cargarse y aplicarse.
    await new Promise(resolve => setTimeout(resolve, 100));

    // Captura el clon estilizado.
    const canvas = await html2canvas(clone, { 
        useCORS: true, 
        backgroundColor: '#ffffff',
        // Se establece la escala para mejorar la resolución; 2 es bueno para pantallas retina.
        scale: 2 
    });

    // Limpia eliminando el clon del DOM.
    document.body.removeChild(clone);

    return canvas;
};

export const downloadElementAsPng = async (element, filename) => {
    try {
        const canvas = await renderElementToCanvas(element);
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error al generar la imagen desde el elemento:", error);
        alert("No se pudo generar la imagen.");
    }
};

export const downloadAllAsZip = async (containerElements, zipName) => {
    if (containerElements.length === 0) {
        alert('No hay imágenes para descargar.');
        return;
    }

    try {
        const zip = new JSZip();
        for (let i = 0; i < containerElements.length; i++) {
            const container = containerElements[i];
            // El PostTemplate real es el primer hijo del contenedor.
            const elementToRender = container.firstChild;
            if (!elementToRender) continue;

            const canvas = await renderElementToCanvas(elementToRender);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            if (blob) {
                zip.file(`post_${i + 1}.png`, blob);
            }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `${zipName}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {        
        console.error("Error al crear el archivo zip:", error);
        alert("No se pudo crear el archivo zip.");
    }
};