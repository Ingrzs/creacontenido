import React, { useRef } from 'react';
import { PostTemplate } from './PostTemplate.js';
import { Button } from './ui/Button.js';

// FIX: Changed component signature to accept `props` to fix type inference issue with `children`.
const AlignButton = (props) => (
    React.createElement('button', { onClick: props.onClick, className: `p-2 rounded-md flex-grow text-xs sm:text-sm ${props.active ? 'bg-cyan-500 text-white' : 'bg-gray-600 hover:bg-gray-500'}` },
        props.children
    )
);

export const Preview = ({ previewData, onPreviewDataChange }) => {
    const fileInputRef = useRef(null);
    const backgroundFileInputRef = useRef(null);

    const handleFileUpload = (event, key) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onPreviewDataChange(key, e.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerificationChange = (type) => {
        const newType = previewData.verificationType === type ? 'none' : type;
        onPreviewDataChange('verificationType', newType);
    };

    const fonts = ['Inter', 'Roboto', 'Lato', 'Open Sans', 'Montserrat', 'Poppins', 'Oswald', 'Raleway', 'Noto Sans', 'Source Sans Pro'];

    return (
        React.createElement('div', { className: "space-y-4" },
            React.createElement('h2', { className: "text-xl font-bold" }, "Vista Previa en Vivo"),
            React.createElement('div', { className: "p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-4" },
                React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 items-end" },
                    React.createElement('div', null,
                        React.createElement('label', { htmlFor: "font-selector", className: "block text-sm font-medium text-gray-300 mb-1" }, "Fuente"),
                        // FIX: Cast props to `any` to resolve incorrect type error on `id` attribute.
                        React.createElement('select', {
                            id: "font-selector",
                            value: previewData.font,
                            onChange: (e) => onPreviewDataChange('font', e.target.value),
                            className: "w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500"
                        } as any,
                            fonts.map(f => React.createElement('option', { key: f, value: f }, f))
                        )
                    ),
                     React.createElement('div', null,
                         React.createElement('label', { className: "block text-sm font-medium text-gray-300 mb-1" }, "Alineación y Fondo"),
                         React.createElement('div', { className: "flex gap-2" },
                             React.createElement(AlignButton, { onClick: () => onPreviewDataChange('alignment', 'left'), active: previewData.alignment === 'left' }, "L"),
                             React.createElement(AlignButton, { onClick: () => onPreviewDataChange('alignment', 'center'), active: previewData.alignment === 'center' }, "C"),
                             React.createElement(AlignButton, { onClick: () => onPreviewDataChange('alignment', 'right'), active: previewData.alignment === 'right' }, "R"),
                             React.createElement(AlignButton, { onClick: () => onPreviewDataChange('alignment', 'justify'), active: previewData.alignment === 'justify' }, "J"),
                             React.createElement(Button, { variant: "secondary", onClick: () => backgroundFileInputRef.current?.click(), className: "flex-grow text-xs" }, "Cambiar Fondo"),
                             previewData.customBackgroundUrl && (
                                React.createElement(Button, { variant: "secondary", onClick: () => onPreviewDataChange('customBackgroundUrl', ''), className: "flex-grow text-xs bg-red-700 hover:bg-red-600" }, "Quitar")
                             )
                         )
                    )
                ),
                 
                 React.createElement('div', { className: "space-y-3 pt-4 border-t border-gray-700 mt-4" },
                     React.createElement('div', { className: "flex items-center" },
                        React.createElement('input', { type: "checkbox", id: "verified-badge-facebook", checked: previewData.verificationType === 'facebook', onChange: () => handleVerificationChange('facebook'), className: "h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" }),
                        React.createElement('label', { htmlFor: "verified-badge-facebook", className: "ml-2 block text-sm text-gray-300" }, "Mostrar verificado facebook")
                     ),
                     React.createElement('div', { className: "flex items-center" },
                        React.createElement('input', { type: "checkbox", id: "verified-badge-twitter", checked: previewData.verificationType === 'twitter', onChange: () => handleVerificationChange('twitter'), className: "h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" }),
                        React.createElement('label', { htmlFor: "verified-badge-twitter", className: "ml-2 block text-sm text-gray-300" }, "Mostrar verificado twitter")
                     )
                 )
            ),
            
            React.createElement('div', { className: "flex justify-center items-start p-4 bg-gray-800 rounded-lg border border-gray-700" },
                React.createElement(PostTemplate, { 
                    data: {...previewData, text: previewData.text || "Esta es una vista previa..."},
                    isEditable: true,
                    onDataChange: onPreviewDataChange,
                    onProfilePicClick: () => fileInputRef.current?.click()
                })
            ),
             React.createElement('input', {
                type: "file",
                ref: fileInputRef,
                className: "hidden",
                accept: "image/*",
                onChange: (e) => handleFileUpload(e, 'profilePic')
            }),
             React.createElement('input', {
                type: "file",
                ref: backgroundFileInputRef,
                className: "hidden",
                accept: "image/*",
                onChange: (e) => handleFileUpload(e, 'customBackgroundUrl')
            })
        )
    );
};