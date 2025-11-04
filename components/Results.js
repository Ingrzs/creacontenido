import React, { useRef } from 'react';
import { PostTemplate } from './PostTemplate.js';
import { downloadElementAsPng } from '../services/imageService.js';
import { Button } from './ui/Button.js';

const TrashIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { fillRule: "evenodd", d: "M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z", clipRule: "evenodd" })
    )
);

const ResultItem = ({ post, previewData, onUpdate, onDelete, onFindImage }) => {
    const postRef = useRef(null);

    const handleDownload = async () => {
        if (postRef.current) {
            const postElement = postRef.current.firstChild;
            if (postElement) {
                await downloadElementAsPng(postElement, 'post');
            }
        }
    };

    const handleTextChange = (key, value) => {
        if (key === 'text') {
            onUpdate(value);
        }
    };

    return (
        React.createElement('div', { className: "result-item bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col gap-4 w-full max-w-md" },
            React.createElement('div', { ref: postRef, className: "post-template-container flex justify-center" },
                React.createElement(PostTemplate, {
                    data: { ...previewData, text: post.text },
                    isEditable: false, // La información del perfil no es editable en los resultados
                    isTextEditable: true, // El texto principal es editable
                    onDataChange: handleTextChange,
                    onProfilePicClick: () => {}
                })
            ),

            React.createElement('div', { className: "mt-2 p-3 bg-gray-900/50 rounded-md" },
                post.isSearchingImages ? (
                    React.createElement('div', { className: "flex items-center justify-center text-gray-400" },
                        React.createElement('svg', { className: "animate-spin -ml-1 mr-3 h-5 w-5 text-cyan-400", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
                            React.createElement('circle', { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                            React.createElement('path', { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })
                        ),
                        React.createElement('span', null, "Buscando imágenes...")
                    )
                ) : post.imageSources && post.imageSources.length > 0 ? (
                    React.createElement('div', { className: "space-y-2" },
                        React.createElement('p', { className: "text-sm text-gray-300" }, "Sugerencias de páginas con imágenes:"),
                        React.createElement('ul', { className: "space-y-1" },
                            post.imageSources.map((source, index) => (
                                React.createElement('li', { key: index },
                                    React.createElement('a', { 
                                        href: source.pageUrl, 
                                        target: "_blank", 
                                        rel: "noopener noreferrer", 
                                        className: "text-cyan-400 hover:underline text-sm flex items-center gap-2"
                                    },
                                        React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor" },
                                          React.createElement('path', { d: "M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" }),
                                          React.createElement('path', { d: "M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" })
                                        ),
                                        source.title || `Visitar sugerencia ${index + 1}`
                                    )
                                )
                            ))
                        )
                    )
                ) : (
                    React.createElement(Button, { onClick: onFindImage, variant: "secondary", className: "w-full" },
                        "Buscar inspiración de imagen"
                    )
                )
            ),

            React.createElement('div', { className: "flex gap-2" },
                React.createElement(Button, { onClick: handleDownload, variant: "secondary", className: "flex-grow" }, "Descargar"),
                React.createElement(Button, { onClick: onDelete, variant: "secondary", className: "bg-red-800 hover:bg-red-700 !px-3", "aria-label": "Eliminar post" },
                    React.createElement(TrashIcon, null)
                )
            )
        )
    );
};

export const Results = ({ posts, previewData, onDownloadAll, onUpdatePost, onDeletePost, onFindImage }) => {
    if (posts.length === 0) {
        return null;
    }

    return (
        React.createElement('div', { className: "space-y-4" },
            React.createElement('div', { className: "flex justify-between items-center" },
                React.createElement('h2', { className: "text-xl font-bold" }, "Posts Generados"),
                React.createElement(Button, { onClick: onDownloadAll }, "Descargar Todo (.zip)")
            ),
            React.createElement('div', { className: "flex flex-col items-center gap-4" },
                posts.map((post) => (
                    React.createElement(ResultItem, {
                        key: post.id,
                        post: post,
                        previewData: previewData,
                        onUpdate: (newText) => onUpdatePost(post.id, newText),
                        onDelete: () => onDeletePost(post.id),
                        onFindImage: () => onFindImage(post.id)
                    })
                ))
            )
        )
    );
};