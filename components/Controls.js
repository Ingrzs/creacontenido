import React, { useEffect, useState } from 'react';
import { CONTENT_STRATEGY_MAP, TONES, REACTIONS } from '../constants.js';
import { NicheInspiration } from './NicheInspiration.js';
import { ProfileManager } from './ProfileManager.js';
import { Button, ModeButton } from './ui/Button.js';
import { Label } from './ui/Label.js';
import { Select } from './ui/Select.js';
import { Input, Textarea } from './ui/Input.js';

const ControlSection = (props) => (
    React.createElement('div', { className: "p-4 bg-gray-800 rounded-lg border border-gray-700" },
        React.createElement('h3', { className: "text-lg font-semibold mb-3 text-cyan-300" }, props.title),
        React.createElement('div', { className: "space-y-4" },
            props.children
        )
    )
);

export const Controls = ({
    generationMode, setGenerationMode, manualText, setManualText,
    aiConfig, setAiConfig, onGenerate, isLoading,
    profiles, activeProfileId, onSelectProfile, onSaveProfile, onDeleteProfile, onRenameProfile,
    apiKey, setApiKey
}) => {
    
    const [tooltip, setTooltip] = useState('');

    const handleAiConfigChange = (key, value) => {
        setAiConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleContentTypeChange = (newContentType) => {
        const strategy = CONTENT_STRATEGY_MAP[newContentType];
        if (strategy) {
            setAiConfig(prevConfig => ({
                ...prevConfig,
                contentType: newContentType,
                tone: strategy.tone,
                reaction: strategy.reaction,
            }));
        } else {
            handleAiConfigChange('contentType', newContentType);
        }
    };

    useEffect(() => {
        const strategy = CONTENT_STRATEGY_MAP[aiConfig.contentType];
        if (strategy) {
            setTooltip(`💡 Sugerencia: ${strategy.tooltip}`);
        } else {
            setTooltip('');
        }
    }, [aiConfig.contentType]);


    return (
        React.createElement('div', { className: "space-y-6" },
            React.createElement(ControlSection, { title: "Configuración de API" },
                 React.createElement('div', null,
                    React.createElement(Label, { htmlFor: "api-key" }, "API Key (Google AI Studio)"),
                    React.createElement(Input, { 
                        id: "api-key", 
                        type: "password", 
                        value: apiKey, 
                        onChange: (e) => setApiKey(e.target.value),
                        placeholder: "Ingresa tu API Key aquí"
                    }),
                    React.createElement('p', { className: "text-xs text-gray-400 mt-1" },
                        "Tu clave se guarda localmente y no se comparte."
                    )
                )
            ),
            
            React.createElement(ControlSection, { title: "1. Selecciona Modo de Generación" },
                React.createElement('div', { className: "flex flex-wrap gap-2" },
                    React.createElement(ModeButton, { active: generationMode === 'manual', onClick: () => setGenerationMode('manual') }, "Manual"),
                    React.createElement(ModeButton, { active: generationMode === 'ai-topic', onClick: () => setGenerationMode('ai-topic') }, "Por Tema (IA)"),
                    React.createElement(ModeButton, { active: generationMode === 'ai-trend', onClick: () => setGenerationMode('ai-trend') }, "Por Tendencia (IA)")
                )
            ),

            generationMode === 'manual' && (
                React.createElement(ControlSection, { title: "2. Ingresa los Textos" },
                    React.createElement(Textarea, {
                        value: manualText,
                        onChange: (e) => setManualText(e.target.value),
                        placeholder: "Ingresa cada texto en una nueva línea...",
                        rows: 8
                    })
                )
            ),

            generationMode.startsWith('ai') && (
                 React.createElement(ControlSection, { title: "2. Configura la Generación con IA" },
                    React.createElement(ProfileManager, {
                        profiles: profiles,
                        activeProfileId: activeProfileId,
                        currentAiConfig: aiConfig,
                        onSelectProfile: onSelectProfile,
                        onSaveProfile: onSaveProfile,
                        onDeleteProfile: onDeleteProfile,
                        onRenameProfile: onRenameProfile
                    }),
                     
                    React.createElement(NicheInspiration, {
                        selectedNiche: aiConfig.niche,
                        selectedSubniche: aiConfig.subniche,
                        onNicheChange: (niche) => {
                            handleAiConfigChange('niche', niche);
                            handleAiConfigChange('subniche', ''); // Resetear subnicho cuando el nicho cambia
                            onSelectProfile(null); // Cambiar a modo manual para evitar inconsistencias
                        },
                        onSubnicheChange: (subniche) => {
                            handleAiConfigChange('subniche', subniche);
                            onSelectProfile(null); // Cambiar a modo manual para evitar inconsistencias
                        },
                        onMicrothemeSelect: (theme) => handleAiConfigChange('topic', aiConfig.topic ? `${aiConfig.topic}, ${theme}`: theme)
                    }),
                     
                     generationMode === 'ai-topic' && (
                         React.createElement('div', null,
                            React.createElement(Label, { htmlFor: "ai-topic" }, "Microtema / Tema (opcional)"),
                            React.createElement(Input, { id: "ai-topic", value: aiConfig.topic, onChange: (e) => handleAiConfigChange('topic', e.target.value), placeholder: "ej: trabajo remoto, gatos graciosos"}),
                            React.createElement('p', { className: "text-xs text-gray-400 mt-1" }, "Si dejas esto en blanco, se usará el Nicho/Subnicho seleccionado.")
                         )
                     ),
                     generationMode === 'ai-trend' && (
                         React.createElement(React.Fragment, null,
                            React.createElement('div', null,
                                React.createElement(Label, { htmlFor: "ai-trend-topic" }, "Tema en Tendencia (opcional)"),
                                React.createElement(Input, { id: "ai-trend-topic", value: aiConfig.trendTopic, onChange: (e) => handleAiConfigChange('trendTopic', e.target.value), placeholder: "ej: últimos estrenos de cine" })
                            ),
                            React.createElement('div', null,
                                React.createElement(Label, { htmlFor: "ai-trend-date-filter" }, "Filtro de Fecha"),
                                React.createElement(Select, { id: "ai-trend-date-filter", value: aiConfig.trendDateFilter, onChange: (e) => handleAiConfigChange('trendDateFilter', e.target.value) },
                                    React.createElement('option', { value: "any" }, "Cualquier fecha"),
                                    React.createElement('option', { value: "hour" }, "Última hora"),
                                    React.createElement('option', { value: "4hours" }, "Últimas 4 horas"),
                                    React.createElement('option', { value: "24hours" }, "Últimas 24 horas"),
                                    React.createElement('option', { value: "48hours" }, "Últimas 48 horas"),
                                    React.createElement('option', { value: "7days" }, "Últimos 7 días")
                                )
                            )
                         )
                     ),
                     React.createElement('div', null,
                        React.createElement(Label, { htmlFor: "post-content-type-selector" }, "Tipo de Contenido (Sugerencia)"),
                        React.createElement(Select, { id: "post-content-type-selector", value: aiConfig.contentType, onChange: (e) => handleContentTypeChange(e.target.value) },
                            Object.keys(CONTENT_STRATEGY_MAP).map(key => React.createElement('option', { key: key, value: key }, key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())))
                        ),
                        tooltip && React.createElement('p', { className: "text-xs text-gray-400 mt-1" }, tooltip)
                     ),
                      React.createElement('div', null,
                        React.createElement(Label, { htmlFor: "ai-tone" }, "Tono"),
                        React.createElement(Select, { id: "ai-tone", value: aiConfig.tone, onChange: (e) => handleAiConfigChange('tone', e.target.value) },
                            TONES.map(tone => React.createElement('option', { key: tone.value, value: tone.value }, tone.label))
                        )
                      ),
                      React.createElement('div', null,
                        React.createElement(Label, { htmlFor: "ai-reaction" }, "Objetivo (Reacción)"),
                        React.createElement(Select, { id: "ai-reaction", value: aiConfig.reaction, onChange: (e) => handleAiConfigChange('reaction', e.target.value) },
                            REACTIONS.map(reaction => React.createElement('option', { key: reaction.value, value: reaction.value }, reaction.label))
                        )
                      ),
                      React.createElement('div', null,
                        React.createElement(Label, null, "Longitud"),
                        React.createElement('div', { className: "flex gap-2" },
                            React.createElement(ModeButton, { active: aiConfig.length === 'muy corto', onClick: () => handleAiConfigChange('length', 'muy corto') }, "Muy Corto"),
                            React.createElement(ModeButton, { active: aiConfig.length === 'corto', onClick: () => handleAiConfigChange('length', 'corto') }, "Corto"),
                            React.createElement(ModeButton, { active: aiConfig.length === 'medio', onClick: () => handleAiConfigChange('length', 'medio') }, "Medio")
                        )
                      ),
                      React.createElement('div', null,
                        React.createElement(Label, { htmlFor: "ai-quantity" }, "Cantidad"),
                        React.createElement(Input, { id: "ai-quantity", type: "number", min: "1", max: "20", value: aiConfig.quantity, onChange: e => handleAiConfigChange('quantity', parseInt(e.target.value, 10) || 1) })
                      )
                 )
            ),
            
            React.createElement(Button, { onClick: onGenerate, disabled: isLoading, className: "w-full" },
                isLoading ? 'Generando...' : `Generar Posts`
            )
        )
    );
};