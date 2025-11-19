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

    const [users, setUsers] = useState([]);
    const [activeUserId, setActiveUserId] = useState(null);
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
            
            const savedApiKey = localStorage.getItem('geminiApiKey');
            if (savedApiKey) {
                setApiKey(savedApiKey);
            }

            // Cargar Usuarios y Perfiles con Migración
            const savedUsers = localStorage.getItem('aiConfigUsers');
            const savedProfiles = localStorage.getItem('aiConfigProfiles');
            
            let loadedProfiles = savedProfiles ? JSON.parse(savedProfiles) : [];
            let loadedUsers = savedUsers ? JSON.parse(savedUsers) : [];

            // Migración: Si hay perfiles pero no usuarios, crear usuario General
            if (loadedProfiles.length > 0 && loadedUsers.length === 0) {
                const generalUser = { id: 'general-default', name: 'General / Mi Marca' };
                loadedUsers = [generalUser];
                // Asignar perfiles huérfanos al usuario general
                loadedProfiles = loadedProfiles.map(p => ({ ...p, userId: generalUser.id }));
                
                localStorage.setItem('aiConfigUsers', JSON.stringify(loadedUsers));
                localStorage.setItem('aiConfigProfiles', JSON.stringify(loadedProfiles));
            }

            setUsers(loadedUsers);
            setProfiles(loadedProfiles);

            if (loadedUsers.length > 0) {
                setActiveUserId(loadedUsers[0].id);
            }

        } catch (error) {
            console.error("Falló al cargar los datos desde localStorage", error);
        }
    }, []);

    // Guardar perfiles
    useEffect(() => {
        try {
            localStorage.setItem('aiConfigProfiles', JSON.stringify(profiles));
        } catch (error) {
            console.error("Falló al guardar los perfiles", error);
        }
    }, [profiles]);

    // Guardar usuarios
    useEffect(() => {
        try {
            localStorage.setItem('aiConfigUsers', JSON.stringify(users));
        } catch (error) {
            console.error("Falló al guardar los usuarios", error);
        }
    }, [users]);

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        localStorage.setItem('geminiApiKey', key);
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

    // User Management
    const handleAddUser = (name) => {
        const newUser = { id: crypto.randomUUID(), name };
        setUsers(prev => [...prev, newUser]);
        setActiveUserId(newUser.id);
        setActiveProfileId(null);
    };

    const handleSelectUser = (userId) => {
        setActiveUserId(userId);
        setActiveProfileId(null);
        const userHasProfiles = profiles.some(p => p.userId === userId);
        if (generationMode === 'ai-mix' && !userHasProfiles) {
            setGenerationMode('manual');
        }
    };

    const handleDeleteUser = (userId) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setProfiles(prev => prev.filter(p => p.userId !== userId));
        if (activeUserId === userId) {
            setActiveUserId(users.length > 1 ? users.find(u => u.id !== userId).id : null);
        }
    };

    // Profile Management
    const handleSelectProfile = (profileId) => {
        setActiveProfileId(profileId);
        if (profileId) {
            const selectedProfile = profiles.find(p => p.id === profileId);
            if (selectedProfile) {
                setAiConfig(prev => ({
                    ...prev,
                    niche: selectedProfile.niche,
                    subniche: selectedProfile.subniche,
                    contentType: selectedProfile.contentType,
                    tone: selectedProfile.tone,
                    reaction: selectedProfile.reaction,
                }));
            }
        }
    };

    const handleSaveProfile = (name) => {
        if (!activeUserId) {
            alert("Debes crear o seleccionar un Usuario/Marca primero.");
            return;
        }
        if (!aiConfig.niche || !aiConfig.subniche) {
            alert("Por favor, selecciona un nicho y un subnicho para guardar el perfil.");
            return;
        }
        const newProfile = {
            id: crypto.randomUUID(),
            userId: activeUserId,
            name,
            niche: aiConfig.niche,
            subniche: aiConfig.subniche,
            contentType: aiConfig.contentType,
            tone: aiConfig.tone,
            reaction: aiConfig.reaction,
        };
        setProfiles(prevProfiles => [...prevProfiles, newProfile]);
        setActiveProfileId(newProfile.id);
    };

    const handleDeleteProfile = (profileId) => {
        setProfiles(prevProfiles => prevProfiles.filter(p => p.id !== profileId));
        if (activeProfileId === profileId) {
            setActiveProfileId(null);
        }
    };

    const handleRenameProfile = (profileId, newName) => {
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
            
            if (generationMode === 'ai-mix') {
                // Mix Mode Logic
                const userProfiles = profiles.filter(p => p.userId === activeUserId);
                if (userProfiles.length === 0) {
                    alert("No tienes perfiles guardados para este usuario. Crea perfiles primero para usar el Modo Mix.");
                    setIsLoading(false);
                    return;
                }

                setLoadingMessage(`Generando mix de ${userProfiles.length} perfiles...`);
                
                const promises = userProfiles.map(profile => {
                    const configForProfile = { 
                        ...profile, 
                        quantity: 1,
                        length: aiConfig.length, 
                        topic: aiConfig.topic 
                    };
                    
                    // REINTENTOS AUTOMÁTICOS
                    const attemptGeneration = async (retryCount = 0) => {
                        try {
                            return await generatePostTextsWithAI('ai-topic', configForProfile, apiKey);
                        } catch (error) {
                            if (retryCount < 3) {
                                // Espera exponencial: 1.5s, 3s, 6s
                                const delay = 1500 * Math.pow(2, retryCount);
                                console.warn(`Reintentando perfil ${profile.name} (Intento ${retryCount + 1}/3) en ${delay}ms...`);
                                await new Promise(resolve => setTimeout(resolve, delay));
                                return attemptGeneration(retryCount + 1);
                            }
                            console.error(`Error definitivo para perfil ${profile.name}:`, error);
                            // Fallback si todo falla
                            return [`(No se pudo generar para ${profile.name}. Intenta de nuevo)`];
                        }
                    };

                    return attemptGeneration();
                });

                const results = await Promise.all(promises);
                texts = results.flat();

            } else if (generationMode.startsWith('ai')) {
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
               errorMessage = error.message;
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
            alert("Error al buscar imagen");
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

    const activeUserProfiles = profiles.filter(p => p.userId === activeUserId);

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
                        
                        users: users,
                        activeUserId: activeUserId,
                        onAddUser: handleAddUser,
                        onSelectUser: handleSelectUser,
                        onDeleteUser: handleDeleteUser,

                        profiles: activeUserProfiles,
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