'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RunResultsChart } from '@/components/run-results-chart';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus, Minus, Share2, Check, Copy } from 'lucide-react';
import AdBanner from './ad-banner';
import { TimeInputGroup } from '@/components/time-input-group';
import { PaceInputGroup } from '@/components/pace-input-group';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { SteppableInput } from '@/components/ui/steppable-input';
import { cn } from '@/lib/utils';

type CalculatorMode = 'pace' | 'distance' | 'duration';
type DistanceUnit = 'km' | 'mi';

interface Time {
    h: number;
    m: number;
    s: number;
}

interface Pace {
    m: number;
    s: number;
}

const EVENTS = [
    { name: '100m', distance: 0.1 },
    { name: '200m', distance: 0.2 },
    { name: '400m', distance: 0.4 },
    { name: '800m', distance: 0.8 },
    { name: '1.5k', distance: 1.5 },
    { name: '1 mile', distance: 1.6093 },
    { name: '5k', distance: 5 },
    { name: '10k', distance: 10 },
    { name: 'Half Marathon', distance: 21.0975 },
    { name: 'Marathon', distance: 42.195 },
    { name: '100k', distance: 100 },
    { name: '100 miles', distance: 160.934 },
];

const EventSelection = ({ onSelect, onSetUnit }: { onSelect: (distance: number) => void, onSetUnit: (unit: DistanceUnit) => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 px-4 flex gap-2 border-primary/20 hover:border-primary/50 transition-colors">
                Select Event <ChevronDown className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
            {EVENTS.map((event) => (
                <DropdownMenuItem
                    key={event.name}
                    onClick={() => {
                        onSelect(event.distance);
                        onSetUnit('km');
                    }}
                    className="cursor-pointer"
                >
                    {event.name}
                </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
    </DropdownMenu>
);

export function RunculatorCalculator() {
    const [mode, setMode] = useLocalStorageState<CalculatorMode>('run-mode', 'pace');
    const [unit, setUnit] = useLocalStorageState<DistanceUnit>('run-unit', 'km');

    // Pace Calculator inputs
    const [paceDuration, setPaceDuration] = useLocalStorageState<Time>('pace-dur', { h: 0, m: 45, s: 0 });
    const [paceDistance, setPaceDistance] = useLocalStorageState<number>('pace-dist', 10);

    // Distance Calculator inputs
    const [distDuration, setDistDuration] = useLocalStorageState<Time>('dist-dur', { h: 1, m: 0, s: 0 });
    const [distPace, setDistPace] = useLocalStorageState<Pace>('dist-pace', { m: 5, s: 0 });

    // Duration Calculator inputs
    const [durDistance, setDurDistance] = useLocalStorageState<number>('dur-dist', 21.1);
    const [durPace, setDurPace] = useLocalStorageState<Pace>('dur-pace', { m: 5, s: 30 });

    // Results
    const [paceResult, setPaceResult] = useLocalStorageState<Pace | null>('pace-res', null);
    const [distanceResult, setDistanceResult] = useLocalStorageState<number | null>('dist-res', null);
    const [durationResult, setDurationResult] = useLocalStorageState<Time | null>('dur-res', null);

    const [copied, setCopied] = useState(false);

    // Helper functions
    const timeToSeconds = (time: Time | Pace): number => {
        const h = (time as Time).h || 0;
        const m = time.m || 0;
        const s = time.s || 0;
        return h * 3600 + m * 60 + s;
    };

    const secondsToTime = (seconds: number): Time => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        return { h, m, s };
    };

    const secondsToPace = (seconds: number): Pace => {
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return { m, s };
    };

    const kmToMiles = (km: number): number => km * 0.621371;
    const milesToKm = (mi: number): number => mi / 0.621371;

    const formatTime = (time: Time): string => {
        const hh = String(time.h).padStart(2, '0');
        const mm = String(time.m).padStart(2, '0');
        const ss = String(time.s).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };

    const formatPaceTime = (pace: Pace, unit: DistanceUnit): string => {
        const mm = String(pace.m).padStart(2, '0');
        const ss = String(pace.s).padStart(2, '0');
        return `${mm}:${ss} /${unit}`;
    };

    // Real-time calculation effects
    useEffect(() => {
        if (mode === 'pace') {
            const totalSeconds = timeToSeconds(paceDuration);
            const distanceInKm = unit === 'km' ? paceDistance : milesToKm(paceDistance);
            if (distanceInKm > 0) {
                const paceSeconds = totalSeconds / distanceInKm;
                setPaceResult(secondsToPace(paceSeconds));
            } else {
                setPaceResult(null);
            }
        }
    }, [paceDuration, paceDistance, unit, mode, setPaceResult]);

    useEffect(() => {
        if (mode === 'distance') {
            const totalSeconds = timeToSeconds(distDuration);
            const paceSeconds = timeToSeconds(distPace);
            if (paceSeconds > 0) {
                const distanceInKm = totalSeconds / paceSeconds;
                const result = unit === 'km' ? distanceInKm : kmToMiles(distanceInKm);
                setDistanceResult(parseFloat(result.toFixed(2)));
            } else {
                setDistanceResult(null);
            }
        }
    }, [distDuration, distPace, unit, mode, setDistanceResult]);

    useEffect(() => {
        if (mode === 'duration') {
            const distanceInKm = unit === 'km' ? durDistance : milesToKm(durDistance);
            const paceSeconds = timeToSeconds(durPace);
            const totalSeconds = distanceInKm * paceSeconds;
            setDurationResult(secondsToTime(totalSeconds));
        }
    }, [durDistance, durPace, unit, mode, setDurationResult]);

    const handleCopy = () => {
        let text = "My Running Prediction from Runculator.com:\n";
        if (mode === 'pace' && paceResult) {
            text += `Distance: ${paceDistance} ${unit}\nDuration: ${formatTime(paceDuration)}\nPace: ${formatPaceTime(paceResult, unit)}`;
        } else if (mode === 'distance' && distanceResult !== null) {
            text += `Duration: ${formatTime(distDuration)}\nPace: ${formatPaceTime(distPace, unit)}\nDistance: ${distanceResult} ${unit}`;
        } else if (mode === 'duration' && durationResult) {
            text += `Distance: ${durDistance} ${unit}\nPace: ${formatPaceTime(durPace, unit)}\nDuration: ${formatTime(durationResult)}`;
        }

        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentPaceSeconds = mode === 'pace' ? (paceResult ? timeToSeconds(paceResult) : 0) :
        mode === 'distance' ? timeToSeconds(distPace) :
            timeToSeconds(durPace);

    const currentDistance = mode === 'pace' ? paceDistance :
        mode === 'distance' ? (distanceResult ?? 0) :
            durDistance;

    return (
        <div className="space-y-12">
            <Card className="w-full max-w-6xl mx-auto shadow-xl border-t-4 border-t-primary overflow-hidden">
                <CardHeader className="pb-4 bg-muted/30 border-b">
                    <CardTitle className="text-3xl font-black text-center tracking-tight uppercase italic">Runculator</CardTitle>
                    <div className="flex justify-center mt-6">
                        <RadioGroup
                            value={unit}
                            onValueChange={(value) => setUnit(value as DistanceUnit)}
                            className="flex gap-8 p-1 bg-background rounded-full px-6 py-2 border shadow-sm"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="km" id="km" />
                                <Label htmlFor="km" className="cursor-pointer font-bold text-xs uppercase tracking-widest">Kilometers</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="mi" id="mi" />
                                <Label htmlFor="mi" className="cursor-pointer font-bold text-xs uppercase tracking-widest">Miles</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardHeader>
                <CardContent className="pt-8">
                    <Tabs value={mode} onValueChange={(value) => setMode(value as CalculatorMode)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-14 mb-10 bg-muted rounded-xl p-1">
                            <TabsTrigger value="pace" className="text-sm font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Pace</TabsTrigger>
                            <TabsTrigger value="distance" className="text-sm font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Distance</TabsTrigger>
                            <TabsTrigger value="duration" className="text-sm font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all">Duration</TabsTrigger>
                        </TabsList>

                        {/* Pace Calculator */}
                        <TabsContent value="pace" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <TimeInputGroup
                                time={paceDuration ?? { h: 0, m: 0, s: 0 }}
                                setTime={setPaceDuration}
                                label="Total Duration"
                            />

                            <div className="space-y-2">
                                <Label htmlFor="pace-distance" className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Distance ({unit})</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <SteppableInput
                                            id="pace-distance"
                                            value={paceDistance ?? 0}
                                            onChange={setPaceDistance}
                                            min={0}
                                            step={0.1}
                                            className="text-2xl h-14"
                                        />
                                    </div>
                                    <EventSelection onSelect={setPaceDistance} onSetUnit={setUnit} />
                                </div>
                            </div>
                        </TabsContent>

                        {/* Distance Calculator */}
                        <TabsContent value="distance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <TimeInputGroup
                                time={distDuration ?? { h: 0, m: 0, s: 0 }}
                                setTime={setDistDuration}
                                label="Total Duration"
                            />

                            <PaceInputGroup
                                unit={unit}
                                pace={distPace ?? { m: 0, s: 0 }}
                                setPace={setDistPace}
                            />
                        </TabsContent>

                        {/* Duration Calculator */}
                        <TabsContent value="duration" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="dur-distance" className="text-xs font-black uppercase tracking-widest text-muted-foreground block">Distance ({unit})</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <SteppableInput
                                            id="dur-distance"
                                            value={durDistance ?? 0}
                                            onChange={setDurDistance}
                                            min={0}
                                            step={0.1}
                                            className="text-2xl h-14"
                                        />
                                    </div>
                                    <EventSelection onSelect={setDurDistance} onSetUnit={setUnit} />
                                </div>
                            </div>

                            <PaceInputGroup
                                unit={unit}
                                pace={durPace ?? { m: 0, s: 0 }}
                                setPace={setDurPace}
                            />
                        </TabsContent>
                    </Tabs>

                    {/* Unified Results Section */}
                    {((mode === 'pace' && paceResult) || (mode === 'distance' && distanceResult !== null) || (mode === 'duration' && durationResult)) && (
                        <div className="mt-12 space-y-12 animate-in zoom-in-95 duration-500">
                            <div className="relative group p-8 bg-primary/5 border-2 border-primary/20 rounded-3xl text-center space-y-4 shadow-inner overflow-hidden">
                                <div className="absolute top-4 right-4 z-20">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-primary/10 transition-colors"
                                        onClick={handleCopy}
                                    >
                                        {copied ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5 text-primary" />}
                                    </Button>
                                </div>
                                <div className="space-y-1 relative z-10">
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Estimated {mode}</p>
                                    <p className="text-6xl md:text-8xl font-black text-primary tracking-tighter drop-shadow-sm italic">
                                        {mode === 'pace' && paceResult ? formatPaceTime(paceResult, unit) :
                                            mode === 'distance' ? `${distanceResult} ${unit}` :
                                                durationResult ? formatTime(durationResult) : ''}
                                    </p>
                                </div>

                                <div className="pt-4 flex flex-wrap justify-center gap-4 text-sm font-bold relative z-10">
                                    <span className="bg-background px-4 py-2 rounded-2xl border-2 border-primary/10 shadow-sm flex items-center gap-2">
                                        <span className="text-muted-foreground">SPEED</span>
                                        <span className="text-primary">{(currentDistance / (timeToSeconds(mode === 'duration' ? (durationResult ?? { h: 0, m: 0, s: 0 }) : mode === 'pace' ? paceDuration : distDuration) / 3600)).toFixed(2)} {unit}/h</span>
                                    </span>
                                </div>

                                {/* Roth style decorative elements */}
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                <Card className="shadow-lg border-2 border-muted/50 overflow-hidden">
                                    <CardHeader className="bg-muted/30 border-b p-4">
                                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-primary rounded-full" />
                                            Intensity Profile
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <RunResultsChart
                                            distance={Math.max(0.1, unit === 'km' ? currentDistance : milesToKm(currentDistance))}
                                            durationSeconds={Math.max(1, timeToSeconds(mode === 'duration' ? (durationResult ?? { h: 0, m: 0, s: 0 }) : mode === 'pace' ? paceDuration : distDuration))}
                                        />
                                    </CardContent>
                                </Card>

                                <Card className="shadow-lg border-2 border-muted/50 overflow-hidden flex flex-col h-full">
                                    <CardHeader className="bg-muted/30 border-b p-4">
                                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                            <div className="w-1.5 h-4 bg-primary rounded-full" />
                                            Pace Splits ({unit})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 flex-grow overflow-auto max-h-[350px]">
                                        <PaceSplitsTable paceSeconds={currentPaceSeconds} totalDistance={currentDistance} unit={unit} />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <AdBanner />
        </div>
    );
}

function PaceSplitsTable({ paceSeconds, totalDistance, unit }: { paceSeconds: number, totalDistance: number, unit: DistanceUnit }) {
    if (paceSeconds <= 0 || totalDistance <= 0) return null;

    const splits = [];
    const interval = totalDistance > 50 ? 5 : 1; // 5km splits for very long distances

    for (let i = interval; i < totalDistance; i += interval) {
        splits.push({ unit: i, time: i * paceSeconds });
    }
    splits.push({ unit: totalDistance, time: totalDistance * paceSeconds });

    const formatSplitTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.round(seconds % 60);
        if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        return `${m}:${String(s).padStart(2, '0')}`;
    };

    return (
        <table className="w-full text-sm">
            <thead className="bg-muted/50 sticky top-0">
                <tr className="border-b">
                    <th className="px-6 py-3 text-left font-black uppercase tracking-widest text-[10px] text-muted-foreground w-1/3">Split ({unit})</th>
                    <th className="px-6 py-3 text-right font-black uppercase tracking-widest text-[10px] text-muted-foreground">Elapsed Time</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {splits.map((split, idx) => (
                    <tr key={idx} className={cn(
                        "hover:bg-primary/5 transition-colors group",
                        idx === splits.length - 1 ? "bg-primary/5 font-bold" : ""
                    )}>
                        <td className="px-6 py-4 font-mono text-muted-foreground group-hover:text-primary transition-colors">
                            {idx === splits.length - 1 ? split.unit.toFixed(2) : split.unit} {unit}
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-bold tabular-nums">
                            {formatSplitTime(split.time)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
