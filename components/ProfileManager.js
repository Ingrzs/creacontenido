import React, { useState } from 'react';
import { Button } from './ui/Button.js';
import { Label } from './ui/Label.js';
import { Select } from './ui/Select.js';
import { Input } from './ui/Input.js';

// Icons for the manage modal
const TrashIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
    )
);
const EditIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" })
    )
);
const SaveIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" })
    )
);

export const ProfileManager = ({
    profiles,
    activeProfileId,
    currentAiConfig,
    onSelectProfile,
    onSaveProfile,
    onDeleteProfile,
    onRenameProfile,
}) => {
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [renamingProfile, setRenamingProfile] = useState(null);

    const canSave = currentAiConfig.niche && currentAiConfig.subniche;
    const isCurrentConfigSaved = profiles.some(p => 
        p.niche === currentAiConfig.niche && 
        p.subniche === currentAiConfig.subniche &&
        p.contentType === currentAiConfig.contentType &&
        p.tone === currentAiConfig.tone &&
        p.reaction === currentAiConfig.reaction
    );

    const handleSaveClick = () => {
        const name = prompt("Ingresa un nombre para este perfil:", `${currentAiConfig.niche} - ${currentAiConfig.subniche}`);
        if (name) {
            onSaveProfile(name);
        }
    };
    
    const handleRename = () => {
        if (renamingProfile && renamingProfile.name.trim()) {
            onRenameProfile(renamingProfile.id, renamingProfile.name.trim());
            setRenamingProfile(null);
        }
    };
    
    const handleDelete = (profileId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este perfil?")) {
            onDeleteProfile(profileId);
        }
    };
    
    const ManageModal = () => (
        React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4" },
            React.createElement('div', { className: "bg-gray-800 rounded-lg border border-gray-700 p-6 w-full max-w-md space-y-4" },
                React.createElement('h3', { className: "text-xl font-bold text-cyan-400" }, "Gestionar Perfiles"),
                React.createElement('div', { className: "space-y-2 max-h-80 overflow-y-auto pr-2" },
                    profiles.length > 0 ? profiles.map(profile => (
                        React.createElement('div', { key: profile.id, className: "flex items-center gap-2 p-2 bg-gray-700 rounded-md" },
                            renamingProfile?.id === profile.id ? (
                                React.createElement(Input, { 
                                    value: renamingProfile.name, 
                                    onChange: (e) => setRenamingProfile({ ...renamingProfile, name: e.target.value }),
                                    onKeyDown: (e) => e.key === 'Enter' && handleRename(),
                                    className: "flex-grow",
                                    autoFocus: true
                                })
                            ) : (
                                React.createElement('span', { className: "flex-grow truncate" }, profile.name)
                            ),
                            
                            renamingProfile?.id === profile.id ? (
                                React.createElement(Button, { variant: "secondary", onClick: handleRename, className: "!px-3" }, React.createElement(SaveIcon, null))
                            ) : (
                                React.createElement(Button, { variant: "secondary", onClick: () => setRenamingProfile({ id: profile.id, name: profile.name }), className: "!px-3" }, React.createElement(EditIcon, null))
                            ),
                            
                            React.createElement(Button, { variant: "secondary", onClick: () => handleDelete(profile.id), className: "bg-red-800 hover:bg-red-700 !px-3" }, React.createElement(TrashIcon, null))
                        )
                    )) : (
                        React.createElement('p', { className: "text-gray-400 text-center py-4" }, "No tienes perfiles guardados.")
                    )
                ),
                React.createElement(Button, { onClick: () => { setIsManageModalOpen(false); setRenamingProfile(null); }, className: "w-full" }, "Cerrar")
            )
        )
    );

    return (
        React.createElement('div', { className: "p-4 bg-gray-900/50 rounded-lg border border-gray-700 space-y-4" },
            isManageModalOpen && React.createElement(ManageModal, null),
            React.createElement('h4', { className: "text-md font-semibold text-cyan-300" }, "Perfiles de Nicho"),
            React.createElement('div', { className: "space-y-2" },
                React.createElement(Label, { htmlFor: "profile-select" }, "Cargar o Gestionar Perfil"),
                React.createElement('div', { className: "flex gap-2" },
                    React.createElement(Select, { id: "profile-select", value: activeProfileId || '', onChange: (e) => onSelectProfile(e.target.value || null) },
                        React.createElement('option', { value: "" }, "Selección Manual"),
                        profiles.map(profile => (
                            React.createElement('option', { key: profile.id, value: profile.id }, profile.name)
                        ))
                    ),
                    React.createElement(Button, { variant: "secondary", onClick: () => setIsManageModalOpen(true) }, "Gestionar")
                )
            ),
            React.createElement('div', null,
                React.createElement(Button, { onClick: handleSaveClick, disabled: !canSave || isCurrentConfigSaved, className: "w-full" },
                    isCurrentConfigSaved ? 'Perfil ya guardado' : 'Guardar Configuración Actual como Perfil'
                )
            )
        )
    );
};
