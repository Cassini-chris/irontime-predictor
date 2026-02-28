import { useState, useEffect } from 'react';
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
import { ChevronDown, Plus, Minus } from 'lucide-react';
import AdBanner from './ad-banner';

type CalculatorMode = 'pace' | 'distance' | 'duration';
type DistanceUnit = 'km' | 'mi';

interface Time {
    h: number;
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

const SteppableInput = ({
    value,
    onChange,
    min = 0,
    max,
    step = 1,
    id,
    placeholder,
    className = ""
}: {
    value: number;
    onChange: (val: number) => void;
    min?: number;
    max?: number;
    step?: number;
    id?: string;
    placeholder?: string;
    className?: string;
}) => {
    const increment = () => {
        const newVal = value + step;
        // Round to handle floating point precision issues
        const roundedVal = Math.round(newVal * 10) / 10;
        if (max === undefined || roundedVal <= max) onChange(roundedVal);
    };
    const decrement = () => {
        const newVal = value - step;
        // Round to handle floating point precision issues
        const roundedVal = Math.round(newVal * 10) / 10;
        if (roundedVal >= min) onChange(roundedVal);
    };

    return (
        <div className="flex flex-col gap-1 items-center">
            <div className="relative flex items-center w-full group">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 h-full w-8 rounded-r-none border-r hover:bg-muted/80 z-10"
                    onClick={decrement}
                    type="button"
                >
                    <Minus className="h-3 w-3" />
                </Button>
                <Input
                    id={id}
                    type="number"
                    value={value}
                    onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) onChange(val);
                        else if (e.target.value === '') onChange(0);
                    }}
                    onFocus={(e) => e.target.select()}
                    placeholder={placeholder}
                    className={`text-center font-mono px-8 focus-visible:ring-1 focus-visible:ring-offset-0 ${className}`}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 h-full w-8 rounded-l-none border-l hover:bg-muted/80 z-10"
                    onClick={increment}
                    type="button"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </div>
    );
};

const TimeInputGroup = ({
    time,
    onChange,
    label
}: {
    time: Time;
    onChange: (time: Time) => void;
    label: string;
}) => (
    <div className="space-y-3">
        <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{label}</Label>
        <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
                <Label htmlFor={`${label}-h`} className="text-xs text-muted-foreground block text-center">Hours</Label>
                <SteppableInput
                    id={`${label}-h`}
                    value={time.h}
                    onChange={(h) => onChange({ ...time, h })}
                    min={0}
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor={`${label}-m`} className="text-xs text-muted-foreground block text-center">Minutes</Label>
                <SteppableInput
                    id={`${label}-m`}
                    value={time.m}
                    onChange={(m) => onChange({ ...time, m })}
                    min={0}
                    max={59}
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor={`${label}-s`} className="text-xs text-muted-foreground block text-center">Seconds</Label>
                <SteppableInput
                    id={`${label}-s`}
                    value={time.s}
                    onChange={(s) => onChange({ ...time, s })}
                    min={0}
                    max={59}
                />
            </div>
        </div>
    </div>
);

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
    const [mode, setMode] = useState<CalculatorMode>('pace');
    const [unit, setUnit] = useState<DistanceUnit>('km');

    // Pace Calculator inputs
    const [paceDuration, setPaceDuration] = useState<Time>({ h: 0, m: 45, s: 0 });
    const [paceDistance, setPaceDistance] = useState<number>(10);

    // Distance Calculator inputs
    const [distDuration, setDistDuration] = useState<Time>({ h: 1, m: 0, s: 0 });
    const [distPace, setDistPace] = useState<Time>({ h: 0, m: 5, s: 0 });

    // Duration Calculator inputs
    const [durDistance, setDurDistance] = useState<number>(21.1);
    const [durPace, setDurPace] = useState<Time>({ h: 0, m: 5, s: 30 });

    // Results
    const [paceResult, setPaceResult] = useState<Time | null>(null);
    const [distanceResult, setDistanceResult] = useState<number | null>(null);
    const [durationResult, setDurationResult] = useState<Time | null>(null);

    // Helper functions
    const timeToSeconds = (time: Time): number => {
        return (time.h || 0) * 3600 + (time.m || 0) * 60 + (time.s || 0);
    };

    const secondsToTime = (seconds: number): Time => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        return { h, m, s };
    };

    const kmToMiles = (km: number): number => km * 0.621371;
    const milesToKm = (mi: number): number => mi / 0.621371;

    const formatTime = (time: Time): string => {
        const hh = String(time.h).padStart(2, '0');
        const mm = String(time.m).padStart(2, '0');
        const ss = String(time.s).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };

    const formatPace = (time: Time, unit: DistanceUnit): string => {
        const mm = String(time.m).padStart(2, '0');
        const ss = String(time.s).padStart(2, '0');
        return `${mm}:${ss} per ${unit}`;
    };

    // Real-time calculation effects
    useEffect(() => {
        if (mode === 'pace') {
            const totalSeconds = timeToSeconds(paceDuration);
            const distanceInKm = unit === 'km' ? paceDistance : milesToKm(paceDistance);
            if (distanceInKm > 0) {
                const paceSeconds = totalSeconds / distanceInKm;
                setPaceResult(secondsToTime(paceSeconds));
            } else {
                setPaceResult(null);
            }
        }
    }, [paceDuration, paceDistance, unit, mode]);

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
    }, [distDuration, distPace, unit, mode]);

    useEffect(() => {
        if (mode === 'duration') {
            const distanceInKm = unit === 'km' ? durDistance : milesToKm(durDistance);
            const paceSeconds = timeToSeconds(durPace);
            const totalSeconds = distanceInKm * paceSeconds;
            setDurationResult(secondsToTime(totalSeconds));
        }
    }, [durDistance, durPace, unit, mode]);



    return (
        <>
            <Card className="w-full max-w-6xl mx-auto shadow-xl border-t-4 border-t-primary">
                <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-black text-center tracking-tight">Pace Calculator</CardTitle>
                    <div className="flex justify-center mt-6">
                        <RadioGroup
                            value={unit}
                            onValueChange={(value) => setUnit(value as DistanceUnit)}
                            className="flex gap-8 p-1 bg-muted rounded-full px-6 py-2"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="km" id="km" />
                                <Label htmlFor="km" className="cursor-pointer font-medium">Kilometers</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="mi" id="mi" />
                                <Label htmlFor="mi" className="cursor-pointer font-medium">Miles</Label>
                            </div>
                        </RadioGroup>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={mode} onValueChange={(value) => setMode(value as CalculatorMode)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-12 mb-8 bg-muted/50">
                            <TabsTrigger value="pace" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pace</TabsTrigger>
                            <TabsTrigger value="distance" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Distance</TabsTrigger>
                            <TabsTrigger value="duration" className="text-base font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Duration</TabsTrigger>
                        </TabsList>

                        {/* Pace Calculator */}
                        <TabsContent value="pace" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <TimeInputGroup
                                time={paceDuration}
                                onChange={setPaceDuration}
                                label="Duration"
                            />

                            <div className="space-y-4">
                                <Label htmlFor="pace-distance" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block">Distance ({unit})</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <SteppableInput
                                            id="pace-distance"
                                            value={paceDistance}
                                            onChange={setPaceDistance}
                                            min={0}
                                            step={0.1}
                                            className="text-2xl h-14"
                                        />
                                    </div>
                                    <EventSelection onSelect={setPaceDistance} onSetUnit={setUnit} />
                                </div>
                            </div>

                            {paceResult && (
                                <div className="mt-8">
                                    <div className="p-8 bg-primary/5 border-2 border-primary/10 rounded-2xl text-center space-y-2 transform transition-all hover:scale-[1.01]">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Estimated Pace per {unit}</p>
                                        <p className="text-5xl font-black text-primary tracking-tighter">
                                            {formatPace(paceResult, unit)}
                                        </p>
                                        <div className="pt-4 flex justify-center gap-4 text-sm font-medium text-muted-foreground">
                                            <span className="bg-background px-3 py-1 rounded-full border">Speed: {(paceDistance / (timeToSeconds(paceDuration) / 3600)).toFixed(2)} {unit}/h</span>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <RunResultsChart
                                            distance={Math.max(0.1, unit === 'km' ? paceDistance : milesToKm(paceDistance))}
                                            durationSeconds={Math.max(1, timeToSeconds(paceDuration))}
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Distance Calculator */}
                        <TabsContent value="distance" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <TimeInputGroup
                                time={distDuration}
                                onChange={setDistDuration}
                                label="Duration"
                            />

                            <TimeInputGroup
                                time={distPace}
                                onChange={setDistPace}
                                label={`Pace (per ${unit})`}
                            />

                            {distanceResult !== null && (
                                <div className="mt-8">
                                    <div className="p-8 bg-primary/5 border-2 border-primary/10 rounded-2xl text-center space-y-2 transform transition-all hover:scale-[1.01]">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Estimated Distance</p>
                                        <p className="text-5xl font-black text-primary tracking-tighter">
                                            {distanceResult} {unit}
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <RunResultsChart
                                            distance={Math.max(0.1, unit === 'km' ? distanceResult : milesToKm(distanceResult))}
                                            durationSeconds={Math.max(1, timeToSeconds(distDuration))}
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        {/* Duration Calculator */}
                        <TabsContent value="duration" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-4">
                                <Label htmlFor="dur-distance" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block">Distance ({unit})</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-grow">
                                        <SteppableInput
                                            id="dur-distance"
                                            value={durDistance}
                                            onChange={setDurDistance}
                                            min={0}
                                            step={0.1}
                                            className="text-2xl h-14"
                                        />
                                    </div>
                                    <EventSelection onSelect={setDurDistance} onSetUnit={setUnit} />
                                </div>
                            </div>

                            <TimeInputGroup
                                time={durPace}
                                onChange={setDurPace}
                                label={`Pace (per ${unit})`}
                            />

                            {durationResult && (
                                <div className="mt-8">
                                    <div className="p-8 bg-primary/5 border-2 border-primary/10 rounded-2xl text-center space-y-2 transform transition-all hover:scale-[1.01]">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">Estimated Duration</p>
                                        <p className="text-5xl font-black text-primary tracking-tighter">
                                            {formatTime(durationResult)}
                                        </p>
                                    </div>
                                    <div className="mt-8">
                                        <RunResultsChart
                                            distance={Math.max(0.1, unit === 'km' ? durDistance : milesToKm(durDistance))}
                                            durationSeconds={Math.max(1, timeToSeconds(durationResult))}
                                        />
                                    </div>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
            <AdBanner />
        </>
    );
}
