'use client';

import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

interface PageHeaderProps {
    title: string;
    description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <header className="text-center space-y-4 relative w-full max-w-6xl mx-auto">
            <div className="absolute top-0 right-0">
                <ThemeToggle />
            </div>
            <div className="inline-flex items-center justify-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-headline">
                    {title}
                </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
            </p>
        </header>
    );
}
