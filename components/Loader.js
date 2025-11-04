import React from 'react';

export const Loader = ({ message }) => {
    return (
        React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50" },
            React.createElement('div', { className: "w-16 h-16 border-4 border-t-cyan-400 border-gray-600 rounded-full animate-spin" }),
            React.createElement('p', { className: "mt-4 text-lg text-white" }, message)
        )
    );
};