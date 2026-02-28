'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';

export function SpeedConverter() {
    const [kmh, setKmh] = useState<string>('');
    const [mph, setMph] = useState<string>('');

    const handleKmhChange = (value: string) => {
        setKmh(value);
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
            setMph((parsed * 0.621371).toFixed(2));
        } else {
            setMph('');
        }
    };

    const handleMphChange = (value: string) => {
        setMph(value);
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
            setKmh((parsed / 0.621371).toFixed(2));
        } else {
            setKmh('');
        }
    };

    return (
        <Card className="w-full max-w-6xl mx-auto shadow-xl border-t-4 border-t-accent">
            <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-black text-center tracking-tight">Speed Converter</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4">
                    <div className="space-y-2 w-full md:w-1/3">
                        <Label htmlFor="kmh-input" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block text-center">Kilometers per hour (km/h)</Label>
                        <Input
                            id="kmh-input"
                            type="number"
                            value={kmh}
                            onChange={(e) => handleKmhChange(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="text-center font-mono text-2xl h-14 focus-visible:ring-1 focus-visible:ring-offset-0"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="hidden md:flex items-center justify-center text-muted-foreground pt-6">
                        <ArrowRightLeft className="w-8 h-8 opacity-50" />
                    </div>

                    <div className="space-y-2 w-full md:w-1/3">
                        <Label htmlFor="mph-input" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block text-center">Miles per hour (mph)</Label>
                        <Input
                            id="mph-input"
                            type="number"
                            value={mph}
                            onChange={(e) => handleMphChange(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="text-center font-mono text-2xl h-14 focus-visible:ring-1 focus-visible:ring-offset-0"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
