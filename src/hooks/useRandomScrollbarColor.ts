import { useEffect } from 'react';

const ACCENT_COLORS = [
    '#FF9FC4', // pink
    '#FF9770', // orange
    '#FFD670', // yellow
    '#268AF9', // blue
    '#B1E0FF', // light-blue
];

/**
 * Hook to set a random accent color for the scrollbar on page load
 * Picks a new random color each time the component mounts
 */
export function useRandomScrollbarColor() {
    useEffect(() => {
        // Pick a random color from the accent colors
        const randomColor = ACCENT_COLORS[Math.floor(Math.random() * ACCENT_COLORS.length)];

        // Set the CSS variable on the root element
        document.documentElement.style.setProperty('--scrollbar-color', randomColor);
    }, []);
}
