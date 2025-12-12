import { useState, useCallback, useRef, useEffect } from 'react';

interface MagneticHoverOptions {
    maxDistance?: number; // Maximum distance for magnetic effect (px)
    maxPull?: number; // Maximum pull strength (px)
    enabled?: boolean; // Enable/disable the effect
}

interface MagneticHoverReturn {
    magneticStyle: {
        transform: string;
        transition: string;
    };
    handleMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
    handleMouseLeave: () => void;
    ref: React.RefObject<HTMLElement | null>;
}

export function useMagneticHover({
    maxDistance = 100,
    maxPull = 10,
    enabled = true,
}: MagneticHoverOptions = {}): MagneticHoverReturn {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const elementRef = useRef<HTMLElement>(null);

    const handleMouseMove = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
            if (!enabled || !elementRef.current) return;

            const rect = elementRef.current.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calculate distance from element center
            const distance = Math.sqrt(
                Math.pow(mouseX - elementCenterX, 2) +
                Math.pow(mouseY - elementCenterY, 2)
            );

            // Calculate pull strength (inverse of distance)
            if (distance < maxDistance) {
                const pull = (maxDistance - distance) / maxDistance;

                // Calculate direction
                const directionX = (mouseX - elementCenterX) / distance;
                const directionY = (mouseY - elementCenterY) / distance;

                // Apply pull
                const translateX = directionX * pull * maxPull;
                const translateY = directionY * pull * maxPull;

                setPosition({ x: translateX, y: translateY });
            } else {
                setPosition({ x: 0, y: 0 });
            }
        },
        [enabled, maxDistance, maxPull]
    );

    const handleMouseLeave = useCallback(() => {
        setPosition({ x: 0, y: 0 });
    }, []);

    const magneticStyle = {
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    };

    return {
        magneticStyle,
        handleMouseMove,
        handleMouseLeave,
        ref: elementRef,
    };
}
