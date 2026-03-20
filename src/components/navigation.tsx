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

    const categories = [
        {
            name: 'Calculators',
            items: [
                { name: 'Triathlon', href: '/triathlon' },
                { name: 'Runculator', href: '/' },
                { name: 'Predictor', href: '/race-predictor' },
            ]
        },
        {
            name: 'Planning',
            items: [
                { name: 'Plans', href: '/training-plans' },
                { name: 'Checklists', href: '/checklists' },
                { name: 'Paces', href: '/training-paces' },
            ]
        },
        {
            name: 'Resources',
            items: [
                { name: 'Athletics', href: '/athletics-records' },
                { name: 'Triathlon', href: '/triathlon-records' },
                { name: 'Expert Guide', href: '/expert-guide' },
            ]
        }
    ];

    const allItems = categories.flatMap(cat => cat.items);

    return (
        <nav className="w-full border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2 shrink-0 mr-8 group">
                            <Logo className="h-7 w-7 text-primary group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-black text-2xl tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                IRONTIME
                            </span>
                        </Link>
                        
                        <div className="flex items-center gap-1 lg:gap-2">
                            {categories.map((cat, idx) => (
                                <div key={cat.name} className="flex items-center gap-1 lg:gap-2">
                                    {idx > 0 && <div className="w-px h-6 bg-border mx-2" />}
                                    <div className="flex gap-1">
                                        {cat.items.map((item) => {
                                            const isActive = pathname === item.href;
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className={cn(
                                                        'relative px-3 py-1.5 text-xs lg:text-sm font-bold transition-all duration-300 rounded-lg whitespace-nowrap',
                                                        'hover:bg-primary/5 hover:text-primary',
                                                        isActive
                                                            ? 'text-primary bg-primary/10 shadow-sm'
                                                            : 'text-muted-foreground'
                                                    )}
                                                >
                                                    {item.name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
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
                                <div className="flex flex-col gap-6 mt-8">
                                    {categories.map((cat) => (
                                        <div key={cat.name} className="space-y-3">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-4">
                                                {cat.name}
                                            </p>
                                            <div className="flex flex-col gap-1">
                                                {cat.items.map((item) => {
                                                    const isActive = pathname === item.href;
                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={item.href}
                                                            onClick={() => setOpen(false)}
                                                            className={cn(
                                                                'block px-4 py-3 text-lg font-bold transition-all duration-200 rounded-xl',
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
                                        </div>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
