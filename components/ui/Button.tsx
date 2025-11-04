import React from 'react';

export const Button = (props) => {
    const { children, className = '', variant = 'primary', ...rest } = props;
    const baseClasses = "px-4 py-2 rounded-md font-semibold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = {
        primary: "bg-cyan-600 hover:bg-cyan-500 focus:ring-cyan-500",
        secondary: "bg-gray-600 hover:bg-gray-500 focus:ring-gray-500",
    };

    return (
        React.createElement('button', { ...rest, className: `${baseClasses} ${variantClasses[variant]} ${className}` },
            children
        )
    );
};

export const ModeButton = (props) => {
    const { children, className = '', active, ...rest } = props;
    const baseClasses = "flex-grow px-3 py-2 text-sm rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
    const activeClasses = "bg-cyan-600 text-white";
    const inactiveClasses = "bg-gray-700 hover:bg-gray-600 text-gray-300";

    return (
        React.createElement('button', { ...rest, className: `${baseClasses} ${active ? activeClasses : inactiveClasses} ${className}` },
            children
        )
    );
};