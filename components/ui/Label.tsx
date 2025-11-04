import React from 'react';

export const Label = (props) => {
    const { children, className = '', ...rest } = props;
    return (
        React.createElement('label', {
            ...rest,
            className: `block text-sm font-medium text-gray-300 mb-1 ${className}`
        },
            children
        )
    );
};