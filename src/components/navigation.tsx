'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Navigation() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Runculator', href: '/' },
        { name: 'Triathlon Calculator', href: '/triathlon' },
        { name: 'Race Predictor', href: '/race-predictor' },
        { name: 'Training Paces', href: '/training-paces' },
    ];

    return (
        <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-16 gap-8">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg',
                                    'hover:bg-primary/10 hover:text-primary',
                                    isActive
                                        ? 'text-primary bg-primary/10'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.name}
                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
