'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';

export function FaviconSwitcher() {
    const { theme, resolvedTheme } = useTheme();
    const pathname = usePathname();

    useEffect(() => {
        let iconPath = '/favicon-1.png'; // Default

        if (pathname === '/triathlon') {
            iconPath = '/favicon-2.png';
        } else if (pathname === '/race-predictor') {
            iconPath = '/favicon-3.png';
        } else if (pathname === '/training-paces') {
            iconPath = '/favicon-small.png'; // Or 4 if I had it
        }

        // Find or create favicon link element
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }

        link.href = iconPath;
        link.type = 'image/png';
    }, [pathname]);

    return null;
}
