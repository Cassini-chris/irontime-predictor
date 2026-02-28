'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Timer, TrendingUp, Info } from 'lucide-react';
import {
    AreaChart,
    Area,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';
import { TimeInputGroup } from './time-input-group';
import AdBanner from './ad-banner';

type Time = { h: number; m: number; s: number };

const DISTANCES = [
    { name: '1500m', distance: 1.5 },
    { name: '1 Mile', distance: 1.6093 },
    { name: '3k', distance: 3 },
    { name: '5k', distance: 5 },
    { name: '5 Miles', distance: 8.04672 },
    { name: '10k', distance: 10 },
    { name: '10 Miles', distance: 16.0934 },
    { name: 'Half Marathon', distance: 21.0975 },
    { name: 'Marathon', distance: 42.195 },
    { name: '50k', distance: 50 },
    { name: '50 Miles', distance: 80.4672 },
    { name: '100k', distance: 100 },
    { name: '100 Miles', distance: 160.934 },
];

const PREDICTION_DISTANCES = [
    { name: '5k', distance: 5 },
    { name: '10k', distance: 10 },
    { name: 'Half Marathon', distance: 21.0975 },
    { name: 'Marathon', distance: 42.195 },
    { name: '50k', distance: 50 },
];

// Helper functions (same as Runculator)
const timeToSeconds = (time: Time): number => {
    return (time.h || 0) * 3600 + (time.m || 0) * 60 + (time.s || 0);
};

const secondsToTime = (seconds: number): Time => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return { h, m, s };
};

const formatTime = (time: Time): string => {
    if (time.h > 0) {
        return `${time.h}:${String(time.m).padStart(2, '0')}:${String(time.s).padStart(2, '0')}`;
    }
    return `${time.m}:${String(time.s).padStart(2, '0')}`;
};

const formatSeconds = (seconds: number): string => formatTime(secondsToTime(seconds));

export function RacePredictorCalculator() {
    const [recentDistance, setRecentDistance] = useState(DISTANCES.find(d => d.name === '10k')!);
    const [recentTime, setRecentTime] = useState<Time>({ h: 0, m: 50, s: 0 });

    const totalSeconds = timeToSeconds(recentTime);

    // Riegel's formula Calculate predictions
    const predictions = useMemo(() => {
        if (totalSeconds === 0) return [];
        return DISTANCES.map(d => {
            // T2 = T1 * (D2 / D1)^1.06
            const t2 = totalSeconds * Math.pow(d.distance / recentDistance.distance, 1.06);
            return {
                ...d,
                predictedSeconds: t2,
                predictedTime: secondsToTime(t2),
                paceSeconds: t2 / d.distance
            };
        });
    }, [recentDistance, totalSeconds]);


    const chartData = useMemo(() => {
        const distance = recentDistance.distance;
        let mean = (distance / 5) * 35;
        let std = (distance / 5) * 10;

        if (Math.abs(distance - 5) < 0.1) { mean = 30; std = 8; }
        else if (Math.abs(distance - 10) < 0.1) { mean = 60; std = 15; }
        else if (Math.abs(distance - 21.0975) < 0.2) { mean = 135; std = 25; }
        else if (Math.abs(distance - 42.195) < 0.5) { mean = 270; std = 50; }

        const data = [];
        const minMins = Math.max(mean - 3 * std, (distance / 5) * 13);
        const maxMins = mean + 3 * std;
        const step = (maxMins - minMins) / 50;

        for (let m = minMins; m <= maxMins; m += step) {
            const x = m * 60;
            const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((m - mean) / std, 2));
            data.push({
                timeSeconds: x,
                minutes: m,
                label: formatSeconds(x),
                density: y * 1000
            });
        }
        return data;
    }, [recentDistance]);

    const handleChartClick = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const seconds = data.activePayload[0].payload.timeSeconds;
            setRecentTime(secondsToTime(seconds));
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background/80 backdrop-blur-sm border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-lg text-primary">{formatSeconds(payload[0].payload.timeSeconds)}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">Click to select this time</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="w-full max-w-6xl mx-auto shadow-xl border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="bg-muted/30 pb-8">
                    <CardTitle className="text-2xl flex items-center gap-3">
                        <Timer className="h-6 w-6 text-primary" />
                        Your Recent Race
                    </CardTitle>
                    <CardDescription>
                        Enter a recent race time or select one from the chart below to predict your potential at other distances.
                    </CardDescription>
                </CardHeader>
                <CardContent className="-mt-4 relative px-6 md:px-12 py-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Race Distance</Label>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="w-full h-12 justify-between border-primary/20 hover:border-primary/50 text-lg">
                                            {recentDistance.name} ({recentDistance.distance} km)
                                            <ChevronDown className="h-4 w-4 opacity-50" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-[300px] max-h-[300px] overflow-y-auto">
                                        {DISTANCES.map((d) => (
                                            <DropdownMenuItem
                                                key={d.name}
                                                onClick={() => setRecentDistance(d)}
                                                className="cursor-pointer font-medium py-3"
                                            >
                                                {d.name} ({d.distance} km)
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <TimeInputGroup
                                label="Finish Time"
                                time={recentTime}
                                setTime={setRecentTime}
                            />
                        </div>

                        <div className="space-y-3 bg-card p-4 rounded-xl border border-border/50 shadow-sm relative">
                            <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block mb-4">
                                Interactive Time Select
                            </Label>
                            <div className="h-[200px] w-full cursor-crosshair">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={chartData}
                                        onClick={handleChartClick}
                                        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="density"
                                            stroke="hsl(var(--primary))"
                                            fillOpacity={1}
                                            fill="url(#colorDensity)"
                                            isAnimationActive={false}
                                        />
                                        {totalSeconds > 0 && chartData.length > 0 && totalSeconds >= chartData[0].timeSeconds && totalSeconds <= chartData[chartData.length - 1].timeSeconds && (
                                            <ReferenceLine x={totalSeconds} stroke="hsl(var(--accent))" strokeWidth={3} strokeDasharray="3 3" />
                                        )}
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-xs text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
                                <Info className="h-3 w-3" /> Click on the curve to quickly set your time. The bell curve shows typical finishing distributions.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {totalSeconds > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {predictions.filter(p => p.distance !== recentDistance.distance).map((pred, i) => (
                        <Card key={pred.name} className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/60 backdrop-blur-sm">
                            <CardHeader className="bg-muted/10 pb-4 border-b border-border/10">
                                <CardTitle className="text-xl flex justify-between items-center text-primary/90">
                                    {pred.name}
                                    <TrendingUp className="h-5 w-5 text-muted-foreground opacity-50" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-center space-y-3">
                                    <p className="text-sm font-semibold text-primary uppercase tracking-widest hidden">Predicted Time</p>
                                    <p className="text-4xl sm:text-5xl font-black text-foreground tracking-tighter font-mono bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {formatSeconds(pred.predictedSeconds)}
                                    </p>
                                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full shadow-inner">
                                        <p className="text-sm font-medium text-primary font-mono tracking-wide">
                                            {formatSeconds(pred.paceSeconds)} /km
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <AdBanner />
        </div>
    );
}

