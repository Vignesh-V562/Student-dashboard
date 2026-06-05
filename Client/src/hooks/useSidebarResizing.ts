import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

interface UseSidebarResizingProps {
    containerRef: RefObject<HTMLDivElement | null>;
    initialLeftWidth?: number;
    initialRightWidth?: number;
    minLeft?: number;
    maxLeft?: number;
    minRight?: number;
    maxRight?: number;
}

export const useSidebarResizing = ({
    containerRef,
    initialLeftWidth = 256,
    initialRightWidth = 320,
    minLeft = 200,
    maxLeft = 400,
    minRight = 280,
    maxRight = 500,
}: UseSidebarResizingProps) => {
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const [rightWidth, setRightWidth] = useState(initialRightWidth);
    const [isDraggingLeft, setIsDraggingLeft] = useState(false);
    const [isDraggingRight, setIsDraggingRight] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingLeft && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = e.clientX - containerRect.left;
                if (newWidth >= minLeft && newWidth <= maxLeft) {
                    setLeftWidth(newWidth);
                }
            }
            if (isDraggingRight && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const newWidth = containerRect.right - e.clientX;
                if (newWidth >= minRight && newWidth <= maxRight) {
                    setRightWidth(newWidth);
                }
            }
        };

        const handleMouseUp = () => {
            setIsDraggingLeft(false);
            setIsDraggingRight(false);
        };

        if (isDraggingLeft || isDraggingRight) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingLeft, isDraggingRight, containerRef, minLeft, maxLeft, minRight, maxRight]);

    return {
        leftWidth,
        rightWidth,
        isDraggingLeft,
        isDraggingRight,
        setIsDraggingLeft,
        setIsDraggingRight,
    };
};
