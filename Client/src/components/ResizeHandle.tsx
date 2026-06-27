interface ResizeHandleProps {
  onMouseDown: () => void;
  isDragging: boolean;
}

const ResizeHandle: React.FC<ResizeHandleProps> = ({ onMouseDown, isDragging }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className={`glass-resize-handle relative z-20 shrink-0 ${isDragging ? 'glass-resize-handle-active' : ''}`}
    >
      <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize" />
    </div>
  );
};

export default ResizeHandle;
