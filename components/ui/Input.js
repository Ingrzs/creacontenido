import React from 'react';

export const Input = ({ className = '', ...props }) => {
    return (
        React.createElement('input', {
            className: `w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 ${className}`,
            ...props
        })
    );
};

export const Textarea = ({ className = '', ...props }) => {
    return (
        React.createElement('textarea', {
            className: `w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500 ${className}`,
            ...props
        })
    );
};