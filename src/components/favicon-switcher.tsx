'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function FaviconSwitcher() {
    const { theme, resolvedTheme } = useTheme();

    useEffect(() => {
        const currentTheme = theme;

        // Choose color based on theme
        let color = '#3b82f6'; // Default Blue (Light)

        if (currentTheme === 'dark') {
            color = '#1d4ed8'; // Darker Blue for Dark Theme
        } else if (currentTheme === 'theme-roth') {
            color = '#e11d48'; // Roth Red
        }

        // Generate SVG string
        const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="13" r="8" />
        <line x1="12" y1="5" x2="12" y2="2" />
        <line x1="17" y1="8" x2="19" y2="6" />
        <line x1="12" y1="13" x2="15" y2="10" />
      </svg>
    `.trim();

        // Convert SVG to Data URL
        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;

        // Find or create favicon link element
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        link.href = svgDataUrl;
        link.type = 'image/svg+xml';
    }, [theme, resolvedTheme]);

    return null;
}
