import React from 'react';

interface ResizeHandleProps {
    onMouseDown: () => void;
    isDragging: boolean;
    darkMode: boolean;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isDragging, darkMode }) => {
    return (
        <div
            onMouseDown={onMouseDown}
            className={`relative z-10 w-1 cursor-col-resize group transition-colors ${isDragging
                    ? (darkMode ? 'bg-blue-500' : 'bg-blue-400')
                    : (darkMode ? 'hover:bg-blue-500' : 'hover:bg-blue-400')
                }`}
        >
            <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
        </div>
    );
};

export default ResizeHandle;
