import React from 'react';
import { NICHE_DATA } from '../constants.js';
import { Label } from './ui/Label.js';
import { Select } from './ui/Select.js';

export const NicheInspiration = ({ 
    selectedNiche, 
    selectedSubniche, 
    onNicheChange, 
    onSubnicheChange, 
    onMicrothemeSelect 
}) => {
    const handleNicheChange = (e) => {
        onNicheChange(e.target.value);
    };
    
    const handleSubnicheChange = (e) => {
        onSubnicheChange(e.target.value);
    };

    const handleMicrothemeSelect = (e) => {
        const theme = e.target.value;
        if (theme) {
            onMicrothemeSelect(theme);
            e.target.value = ''; // Restablecer el select para permitir seleccionar otro
        }
    };

    const currentNicheData = NICHE_DATA.find(n => n.niche === selectedNiche);
    const currentSubniches = currentNicheData?.subniches || [];
    const currentMicrothemes = currentSubniches.find(s => s.name === selectedSubniche)?.microtemas || [];

    return (
        React.createElement('div', { className: "p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-3 mt-4" },
            React.createElement('h4', { className: "text-md font-semibold text-cyan-300" }, "¿Sin ideas? Usa la inspiración de nichos"),
            
            React.createElement('div', null,
                React.createElement(Label, { htmlFor: "niche-select", className: "text-sm text-gray-400" }, "1. Elige un Nicho"),
                React.createElement(Select, { id: "niche-select", value: selectedNiche, onChange: handleNicheChange },
                    React.createElement('option', { value: "" }, "Selecciona un nicho..."),
                    NICHE_DATA.map(niche => (
                        React.createElement('option', { key: niche.niche, value: niche.niche }, niche.niche)
                    ))
                )
            ),

            selectedNiche && (
                React.createElement('div', null,
                    React.createElement(Label, { htmlFor: "subniche-select", className: "text-sm text-gray-400" }, "2. Elige un Subnicho"),
                    React.createElement(Select, { id: "subniche-select", value: selectedSubniche, onChange: handleSubnicheChange, disabled: !selectedNiche },
                        React.createElement('option', { value: "" }, "Selecciona un subnicho..."),
                        currentSubniches.map(subniche => (
                           React.createElement('option', { key: subniche.name, value: subniche.name }, subniche.name)
                        ))
                    )
                )
            ),

            selectedSubniche && (
                React.createElement('div', null,
                    React.createElement(Label, { htmlFor: "microtheme-select", className: "text-sm text-gray-400" }, "3. (Opcional) Añade un Microtema"),
                     React.createElement(Select, { id: "microtheme-select", onChange: handleMicrothemeSelect, disabled: !selectedSubniche, value: "" },
                        React.createElement('option', { value: "" }, "Selecciona para añadir al tema..."),
                        currentMicrothemes.map(theme => (
                           React.createElement('option', { key: theme, value: theme }, theme)
                        ))
                    )
                )
            )
        )
    );
};
