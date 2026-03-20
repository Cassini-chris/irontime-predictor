'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SteppableInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: string) => void; // For raw string changes (auto-tabbing)
}

export const SteppableInput = React.forwardRef<HTMLInputElement, SteppableInputProps>(
    ({ value, onChange, onValueChange, min = 0, max, step = 1, className, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        const increment = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newVal = Math.min(max !== undefined ? max : Infinity, value + step);
            onChange(Math.round(newVal * 100) / 100);
        };

        const decrement = (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const newVal = Math.max(min, value - step);
            onChange(Math.round(newVal * 100) / 100);
        };

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
        };

        const displayValue = value === 0 && !isFocused ? '' : value;

        return (
            <div className="relative flex items-center w-full group">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 h-full w-8 rounded-r-none border-r hover:bg-muted/80 z-10"
                    onClick={decrement}
                    tabIndex={-1}
                    type="button"
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <Input
                    {...props}
                    ref={ref}
                    type="number"
                    value={displayValue}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (onValueChange) onValueChange(val);

                        if (val === '') {
                            onChange(0);
                        } else {
                            const numericVal = parseFloat(val);
                            if (!isNaN(numericVal)) {
                                onChange(numericVal);
                            }
                        }
                    }}
                    className={cn(
                        "text-center font-mono px-8 focus-visible:ring-1 focus-visible:ring-offset-0 transition-all min-w-[80px]",
                        className
                    )}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 h-full w-8 rounded-l-none border-l hover:bg-muted/80 z-10"
                    onClick={increment}
                    tabIndex={-1}
                    type="button"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        );
    }
);

SteppableInput.displayName = 'SteppableInput';
