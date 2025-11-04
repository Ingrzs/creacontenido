import React, { useState, useCallback, useEffect } from 'react';
import { Controls } from './components/Controls.js';
import { Preview } from './components/Preview.js';
import { Results } from './components/Results.js';
import { Loader } from './components/Loader.js';
import { generatePostTextsWithAI, findImageForPost } from './services/geminiService.js';
import { downloadAllAsZip } from './services/imageService.js';
import { DEFAULT_AI_CONFIG, DEFAULT_PREVIEW_DATA } from './constants.js';

const App = () => {
    const [generationMode, setGenerationMode] = useState('manual');
    const [apiKey, setApiKey] = useState('');
    
    const [previewData, setPreviewData] = useState(DEFAULT_PREVIEW_DATA);
    const [manualText, setManualText] = useState('');
    const [aiConfig, setAiConfig] = useState(DEFAULT_AI_CONFIG);
    
    const [generatedPosts, setGeneratedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    const [profiles, setProfiles] = useState([]);
    const [activeProfileId, setActiveProfileId] = useState(null);

    // Cargar datos del localStorage al iniciar la aplicación
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('postGeneratorTemplateData');
            if (savedData) {
                const data = JSON.parse(savedData);
                setPreviewData(prev => ({ ...prev, ...data }));
            }
            const savedProfiles = localStorage.getItem('aiConfigProfiles');
            if (savedProfiles) {
                setProfiles(JSON.parse(savedProfiles));
            }
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) {
                setApiKey(savedApiKey);
            }
        } catch (error) {
            console.error("Falló al cargar los datos desde localStorage", error);
        }
    }, []);

    // Guardar perfiles en localStorage cada vez que cambien
    useEffect(() => {
        try {
            localStorage.setItem('aiConfigProfiles', JSON.stringify(profiles));
        } catch (error) {
            console.error("Falló al guardar los perfiles en localStorage", error);
        }
    }, [profiles]);

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        try {
            localStorage.setItem('geminiApiKey', key);
        } catch (error) {
            console.error("Falló al guardar la API Key en localStorage", error);
        }
    };

    const handlePreviewDataChange = useCallback((key, value) => {
        setPreviewData(prev => {
            const newState = { ...prev, [key]: value };
            try {
                const { text, ...dataToSave } = newState;
                localStorage.setItem('postGeneratorTemplateData', JSON.stringify(dataToSave));
            } catch (error)
 {
                console.error("Falló al guardar los datos de la plantilla en localStorage", error);
            }
            return newState;
        });
    }, []);

    const handleSelectProfile = (profileId) => {
        setActiveProfileId(profileId);
        if (profileId) {
            const selectedProfile = profiles.find(p => p.id === profileId);
            if (selectedProfile) {
                setAiConfig(prev => ({
                    ...prev,
                    niche: selectedProfile.niche,
                    subniche: selectedProfile.subniche,
                }));
            }
        }
    };

    const handleSaveProfile = (name) => {
        if (!aiConfig.niche || !aiConfig.subniche) {
            alert("Por favor, selecciona un nicho y un subnicho para guardar el perfil.");
            return;
        }
        const newProfile = {
            id: crypto.randomUUID(),
            name,
            niche: aiConfig.niche,
            subniche: aiConfig.subniche,
        };
        // Usar la forma funcional de setState para garantizar que se basa en el estado más reciente
        setProfiles(prevProfiles => [...prevProfiles, newProfile]);
        setActiveProfileId(newProfile.id);
    };

    const handleDeleteProfile = (profileId) => {
        // Usar la forma funcional de setState
        setProfiles(prevProfiles => prevProfiles.filter(p => p.id !== profileId));
        if (activeProfileId === profileId) {
            setActiveProfileId(null);
        }
    };

    const handleRenameProfile = (profileId, newName) => {
        // Usar la forma funcional de setState
        setProfiles(prevProfiles => 
            prevProfiles.map(p => 
                p.id === profileId ? { ...p, name: newName } : p
            )
        );
    };

    const handleGeneratePosts = async () => {
        if (generationMode.startsWith('ai') && !apiKey) {
            alert("Por favor, ingresa tu API Key de Google AI Studio para continuar.");
            return;
        }
        setIsLoading(true);
        setGeneratedPosts([]);

        try {
            let texts = [];
            if (generationMode.startsWith('ai')) {
                setLoadingMessage('Generando textos con IA...');
                texts = await generatePostTextsWithAI(generationMode, aiConfig, apiKey);
            } else {
                setLoadingMessage('Preparando posts manuales...');
                texts = manualText.split('\n').filter(text => text.trim() !== '');
            }

            if (texts.length === 0) {
                alert('No se generaron textos. Por favor, revisa tu entrada.');
                return;
            }

            setLoadingMessage('Renderizando resultados...');
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const postsWithIds = texts.map(text => ({
                id: crypto.randomUUID(),
                text: text,
                imageSources: [],
                isSearchingImages: false,
            }));
            setGeneratedPosts(postsWithIds);
        } catch (error) {
            console.error("Error al generar posts:", error);
            let errorMessage = "Ocurrió un error inesperado al contactar la IA.";
            if (error instanceof Error) {
                const lowerCaseMessage = error.message.toLowerCase();
                if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('api_key_invalid')) {
                    errorMessage = "Tu API Key no es válida. Por favor, revísala e inténtalo de nuevo.";
                } else if (lowerCaseMessage.includes('permission denied') || lowerCaseMessage.includes('billing')) {
                    errorMessage = "Permiso denegado. Asegúrate de que tu API Key esté habilitada y que la facturación esté configurada para tu proyecto.";
                } else if (lowerCaseMessage.includes('quota')) {
                    errorMessage = "Has excedido tu cuota de uso. Por favor, revisa tus límites en Google AI Studio o espera un momento.";
                } else if (lowerCaseMessage.includes('fetch failed') || lowerCaseMessage.includes('networkerror')) {
                    errorMessage = "Error de red. No se pudo conectar con el servicio de IA. Revisa tu conexión a internet.";
                } else {
                    errorMessage = "Ocurrió un error al generar el contenido. Inténtalo de nuevo.";
                }
            }
            alert(errorMessage);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    const handleFindImage = async (postId) => {
        if (!apiKey) {
            alert("Por favor, ingresa tu API Key para buscar imágenes.");
            return;
        }
        const post = generatedPosts.find(p => p.id === postId);
        if (!post) return;

        setGeneratedPosts(currentPosts =>
            currentPosts.map(p =>
                p.id === postId ? { ...p, isSearchingImages: true, imageSources: [] } : p
            )
        );

        try {
            const imageSources = await findImageForPost(post.text, apiKey);
            setGeneratedPosts(currentPosts =>
                currentPosts.map(p =>
                    p.id === postId ? { ...p, imageSources, isSearchingImages: false } : p
                )
            );
        } catch (error) {
            console.error("Error al buscar imagen:", error);
            let errorMessage = "No se pudo encontrar una imagen. Por favor, inténtalo de nuevo.";
            if (error instanceof Error) {
                const lowerCaseMessage = error.message.toLowerCase();
                if (lowerCaseMessage.includes('api key not valid') || lowerCaseMessage.includes('api_key_invalid')) {
                    errorMessage = "Tu API Key no es válida. Por favor, revísala e inténtalo de nuevo.";
                } else if (lowerCaseMessage.includes('rpc failed') || lowerCaseMessage.includes('networkerror') || lowerCaseMessage.includes('fetch failed')) {
                    errorMessage = "Ocurrió un error de comunicación con el servidor de IA. Esto puede ser un problema temporal. Por favor, inténtalo de nuevo en unos momentos.";
                } else {
                     errorMessage = "Ocurrió un error al buscar la imagen. Inténtalo de nuevo.";
                }
            }
            alert(errorMessage);
            setGeneratedPosts(currentPosts =>
                currentPosts.map(p =>
                    p.id === postId ? { ...p, isSearchingImages: false } : p
                )
            );
        }
    };

    const handleUpdatePostText = (id, newText) => {
        setGeneratedPosts(currentPosts => 
            currentPosts.map(post => 
                post.id === id ? { ...post, text: newText } : post
            )
        );
    };

    const handleDeletePost = (id) => {
        setGeneratedPosts(currentPosts => 
            currentPosts.filter(post => post.id !== id)
        );
    };

    const handleDownloadAll = () => {
        const postElements = document.querySelectorAll('.result-item .post-template-container');
        if (postElements.length > 0) {
            downloadAllAsZip(Array.from(postElements), 'posts');
        } else {
            alert('No hay imágenes generadas para descargar.');
        }
    };

    return (
        React.createElement('div', { className: "min-h-screen bg-gray-900 text-gray-200" },
            isLoading && React.createElement(Loader, { message: loadingMessage }),
            React.createElement('header', { className: "py-4 px-8 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700" },
                React.createElement('h1', { className: "text-2xl font-bold text-cyan-400" }, "Generador de Posts con IA para Redes Sociales")
            ),
            React.createElement('main', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 sm:p-8" },
                React.createElement('div', { className: "lg:col-span-1 space-y-6" },
                    React.createElement(Controls, {
                        generationMode: generationMode,
                        setGenerationMode: setGenerationMode,
                        manualText: manualText,
                        setManualText: setManualText,
                        aiConfig: aiConfig,
                        setAiConfig: setAiConfig,
                        apiKey: apiKey,
                        setApiKey: handleApiKeyChange,
                        onGenerate: handleGeneratePosts,
                        isLoading: isLoading,
                        profiles: profiles,
                        activeProfileId: activeProfileId,
                        onSelectProfile: handleSelectProfile,
                        onSaveProfile: handleSaveProfile,
                        onDeleteProfile: handleDeleteProfile,
                        onRenameProfile: handleRenameProfile
                    })
                ),
                React.createElement('div', { className: "lg:col-span-2 space-y-8" },
                    React.createElement(Preview, {
                        previewData: previewData,
                        onPreviewDataChange: handlePreviewDataChange
                    }),
                    React.createElement(Results, {
                        posts: generatedPosts,
                        previewData: previewData,
                        onDownloadAll: handleDownloadAll,
                        onUpdatePost: handleUpdatePostText,
                        onDeletePost: handleDeletePost,
                        onFindImage: handleFindImage
                    })
                )
            )
        )
    );
};

export default App;
