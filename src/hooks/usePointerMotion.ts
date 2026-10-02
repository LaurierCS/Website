import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';

interface UsePointerMotionOptions {
    maxRotateX?: number;
    maxRotateY?: number;
    maxTranslate?: number;
    hoverScale?: number;
}

const defaultStyle = {
    transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0) scale(1)',
};

export function usePointerMotion(options: UsePointerMotionOptions = {}) {
    const {
        maxRotateX = 2,
        maxRotateY = 2,
        maxTranslate = 5,
        hoverScale = 1.01,
    } = options;

    const [isEnabled, setIsEnabled] = useState(false);
    const [style, setStyle] = useState(defaultStyle);

    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const desktopMedia = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
        const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateEnabled = () => {
            setIsEnabled(desktopMedia.matches && !reducedMotionMedia.matches);
        };

        updateEnabled();

        desktopMedia.addEventListener('change', updateEnabled);
        reducedMotionMedia.addEventListener('change', updateEnabled);

        return () => {
            desktopMedia.removeEventListener('change', updateEnabled);
            reducedMotionMedia.removeEventListener('change', updateEnabled);
        };
    }, []);

    const onMouseMove = useCallback((event: MouseEvent<HTMLElement>) => {
        if (!isEnabled) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = (event.clientX - rect.left) / rect.width;
        const relativeY = (event.clientY - rect.top) / rect.height;

        const rotateY = (relativeX - 0.5) * 2 * maxRotateY;
        const rotateX = (0.5 - relativeY) * 2 * maxRotateX;
        const translateX = (relativeX - 0.5) * 2 * maxTranslate;
        const translateY = (relativeY - 0.5) * 2 * maxTranslate;

        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
        }

        frameRef.current = requestAnimationFrame(() => {
            setStyle({
                transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0) scale(${hoverScale})`,
            });
        });
    }, [hoverScale, isEnabled, maxRotateX, maxRotateY, maxTranslate]);

    const onMouseLeave = useCallback(() => {
        if (frameRef.current) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }

        setStyle(defaultStyle);
    }, []);

    useEffect(() => {
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);

    return {
        isEnabled,
        motionStyle: isEnabled ? style : undefined,
        onMouseMove,
        onMouseLeave,
    };
}

export default usePointerMotion;