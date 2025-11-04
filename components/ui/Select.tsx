import React from 'react';

export const Select = (props) => {
    const { children, className = '', ...rest } = props;
    return (
        React.createElement('select', {
            ...rest,
            className: `w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 ${className}`
        },
            children
        )
    );
};