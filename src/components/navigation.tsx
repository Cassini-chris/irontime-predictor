'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { useState } from 'react';

export function Navigation() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: 'Runculator', href: '/' },
        { name: 'Triathlon Calculator', href: '/triathlon' },
        { name: 'Training Plans', href: '/training-plans' },
        { name: 'Race Checklists', href: '/checklists' },
        { name: 'Race Predictor', href: '/race-predictor' },
        { name: 'Training Paces', href: '/training-paces' },
        { name: 'Athletics Records', href: '/athletics-records' },
        { name: 'Triathlon Records', href: '/triathlon-records' },
    ];

    return (
        <nav className="w-full border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center w-full gap-4 lg:gap-8">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'relative px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap',
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

                    {/* Mobile Navigation */}
                    <div className="md:hidden flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2">
                            <Logo className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                IRONTIME
                            </span>
                        </Link>
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="text-left">Navigation</SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={cn(
                                                    'block px-4 py-3 text-lg font-medium transition-all duration-200 rounded-xl',
                                                    isActive
                                                        ? 'text-primary bg-primary/10'
                                                        : 'text-muted-foreground hover:bg-accent/10 hover:text-accent'
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
