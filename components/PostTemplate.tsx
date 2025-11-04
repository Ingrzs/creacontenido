import React, { useRef, useState, useEffect, useCallback } from 'react';

const EditableField = ({ value, onBlur, className }) => (
    React.createElement('span', {
        contentEditable: true,
        suppressContentEditableWarning: true,
        onBlur: (e) => onBlur(e.currentTarget.textContent || ''),
        className: className
    }, value)
);

const VerifiedBadge = ({ type }) => {
    const color = type === 'facebook' ? 'text-blue-600' : 'text-blue-500';
    return (
        React.createElement('svg', { className: `w-5 h-5 ${color}`, fill: "currentColor", viewBox: "0 0 24 24" },
            React.createElement('path', { d: "M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s-2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.5 4.86L6.71 12.8l1.42-1.42 2.62 2.62 6.03-6.03 1.42 1.42-7.45 7.47z" })
        )
    );
};


export const PostTemplate = ({ data, isEditable = false, isTextEditable = false, onDataChange, onProfilePicClick }) => {
    const { 
        profilePic, 
        name, 
        username, 
        font, 
        alignment, 
        text,
        verificationType,
        customBackgroundUrl,
        backgroundTextPosition,
    } = data;

    const fontStyle = { fontFamily: `'${font}', sans-serif` };
    const textAlignClass = `text-${alignment}`;
    const baseClasses = "max-w-md w-full rounded-lg shadow-lg overflow-hidden";
    
    // --- Lógica de Arrastrar y Soltar ---
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const handleMouseDown = useCallback((e) => {
        if (!isEditable || isTextEditable) return;
        e.preventDefault();
        setIsDragging(true);
    }, [isEditable, isTextEditable]);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current || !textRef.current || !onDataChange) return;
        
        const containerRect = containerRef.current.getBoundingClientRect();
        
        let newX = e.clientX - containerRect.left;
        let newY = e.clientY - containerRect.top;

        // Limitar a los bordes del contenedor
        newX = Math.max(0, Math.min(newX, containerRect.width));
        newY = Math.max(0, Math.min(newY, containerRect.height));

        const newPosition = {
            x: (newX / containerRect.width) * 100,
            y: (newY / containerRect.height) * 100,
        };
        
        onDataChange('backgroundTextPosition', newPosition);

    }, [isDragging, onDataChange]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);
    // --- Fin de la Lógica ---

    // Vista con fondo de imagen personalizado
    if (customBackgroundUrl) {
        const textPositionStyle = {
            left: `${backgroundTextPosition.x}%`,
            top: `${backgroundTextPosition.y}%`,
            transform: 'translate(-50%, -50%)', // Centra el texto en las coordenadas
            textAlign: 'center', // El texto arrastrable siempre se ve mejor centrado
            cursor: isEditable && !isTextEditable ? 'move' : 'default',
            userSelect: 'none',
        };

        return (
            React.createElement('div', {
                ref: containerRef,
                className: `${baseClasses} aspect-square bg-cover bg-center relative`,
                style: { backgroundImage: `url(${customBackgroundUrl})` }
            },
                React.createElement('div', { className: "absolute inset-0 bg-black bg-opacity-30" }),
                React.createElement('p', {
                    ref: textRef,
                    onMouseDown: handleMouseDown,
                    contentEditable: isTextEditable,
                    suppressContentEditableWarning: true,
                    onBlur: (e) => isTextEditable && onDataChange?.('text', e.currentTarget.textContent || text),
                    className: "absolute text-white whitespace-pre-wrap break-words max-w-[90%]",
                    style: {...fontStyle, ...textPositionStyle, textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}
                }, text)
            )
        );
    }
    
    // Vista de post estándar
    return (
        React.createElement('div', { className: `${baseClasses} p-4 bg-white text-black` },
            React.createElement('div', { className: "flex items-start space-x-3" },
                React.createElement('img', { src: profilePic, alt: "Profile", className: "w-12 h-12 rounded-full cursor-pointer object-cover", onClick: onProfilePicClick }),
                React.createElement('div', { className: "flex-1 min-w-0" },
                    React.createElement('div', null,
                        React.createElement('div', { className: "flex items-center space-x-1" },
                            isEditable ? 
                                React.createElement(EditableField, { value: name, onBlur: (v) => onDataChange?.('name', v), className: "font-bold text-gray-900" })
                                : React.createElement('span', { className: "font-bold text-gray-900" }, name),
                            verificationType !== 'none' && React.createElement(VerifiedBadge, { type: verificationType })
                        ),
                        isEditable ? 
                            React.createElement(EditableField, { value: username, onBlur: (v) => onDataChange?.('username', v), className: "text-gray-500" })
                            : React.createElement('span', { className: "text-gray-500" }, username)
                    )
                )
            ),
            isTextEditable ? (
                // FIX: Cast props to `any` to resolve incorrect type error on `contentEditable` attribute.
                React.createElement('p', {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onBlur: (e) => onDataChange?.('text', e.currentTarget.textContent || text),
                    className: `mt-2 whitespace-pre-wrap break-words ${textAlignClass}`,
                    style: fontStyle
                } as any, text)
            ) : (
                React.createElement('p', { className: `mt-2 whitespace-pre-wrap break-words ${textAlignClass}`, style: fontStyle }, text)
            )
        )
    );
};