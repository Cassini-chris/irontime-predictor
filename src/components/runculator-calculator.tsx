'use client';

import { useState } from 'react';
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
import { ChevronDown } from 'lucide-react';

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
        return time.h * 3600 + time.m * 60 + time.s;
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

    // Calculate Pace
    const calculatePace = () => {
        const totalSeconds = timeToSeconds(paceDuration);
        const distanceInKm = unit === 'km' ? paceDistance : milesToKm(paceDistance);

        if (distanceInKm === 0) {
            setPaceResult(null);
            return;
        }

        const paceSeconds = totalSeconds / distanceInKm;
        setPaceResult(secondsToTime(paceSeconds));
    };

    // Calculate Distance
    const calculateDistance = () => {
        const totalSeconds = timeToSeconds(distDuration);
        const paceSeconds = timeToSeconds(distPace);

        if (paceSeconds === 0) {
            setDistanceResult(null);
            return;
        }

        const distanceInKm = totalSeconds / paceSeconds;
        const result = unit === 'km' ? distanceInKm : kmToMiles(distanceInKm);
        setDistanceResult(parseFloat(result.toFixed(2)));
    };

    // Calculate Duration
    const calculateDuration = () => {
        const distanceInKm = unit === 'km' ? durDistance : milesToKm(durDistance);
        const paceSeconds = timeToSeconds(durPace);

        const totalSeconds = distanceInKm * paceSeconds;
        setDurationResult(secondsToTime(totalSeconds));
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
        <div className="space-y-2">
            <Label className="text-sm font-medium">{label}</Label>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <Label htmlFor={`${label}-h`} className="text-xs text-muted-foreground">Hours</Label>
                    <Input
                        id={`${label}-h`}
                        type="number"
                        min="0"
                        value={time.h}
                        onChange={(e) => onChange({ ...time, h: parseInt(e.target.value) || 0 })}
                        className="text-center"
                    />
                </div>
                <div>
                    <Label htmlFor={`${label}-m`} className="text-xs text-muted-foreground">Minutes</Label>
                    <Input
                        id={`${label}-m`}
                        type="number"
                        min="0"
                        max="59"
                        value={time.m}
                        onChange={(e) => onChange({ ...time, m: parseInt(e.target.value) || 0 })}
                        className="text-center"
                    />
                </div>
                <div>
                    <Label htmlFor={`${label}-s`} className="text-xs text-muted-foreground">Seconds</Label>
                    <Input
                        id={`${label}-s`}
                        type="number"
                        min="0"
                        max="59"
                        value={time.s}
                        onChange={(e) => onChange({ ...time, s: parseInt(e.target.value) || 0 })}
                        className="text-center"
                    />
                </div>
            </div>
        </div>
    );

    const EventSelection = ({ onSelect }: { onSelect: (distance: number) => void }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-fit flex gap-2">
                    Select Event <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-[300px] overflow-y-auto">
                {EVENTS.map((event) => (
                    <DropdownMenuItem
                        key={event.name}
                        onClick={() => {
                            onSelect(event.distance);
                            setUnit('km');
                        }}
                    >
                        {event.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Pace Calculator</CardTitle>
                <div className="flex justify-center mt-4">
                    <RadioGroup
                        value={unit}
                        onValueChange={(value) => setUnit(value as DistanceUnit)}
                        className="flex gap-4"
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="km" id="km" />
                            <Label htmlFor="km" className="cursor-pointer">Kilometers</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mi" id="mi" />
                            <Label htmlFor="mi" className="cursor-pointer">Miles</Label>
                        </div>
                    </RadioGroup>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs value={mode} onValueChange={(value) => setMode(value as CalculatorMode)}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="pace">Pace</TabsTrigger>
                        <TabsTrigger value="distance">Distance</TabsTrigger>
                        <TabsTrigger value="duration">Duration</TabsTrigger>
                    </TabsList>

                    {/* Pace Calculator */}
                    <TabsContent value="pace" className="space-y-6 mt-6">
                        <TimeInputGroup
                            time={paceDuration}
                            onChange={setPaceDuration}
                            label="Duration"
                        />

                        <div className="space-y-4">
                            <div className="flex items-end justify-between gap-4">
                                <div className="space-y-2 flex-grow">
                                    <Label htmlFor="pace-distance">Distance ({unit})</Label>
                                    <Input
                                        id="pace-distance"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={paceDistance}
                                        onChange={(e) => setPaceDistance(parseFloat(e.target.value) || 0)}
                                        className="text-center text-lg"
                                    />
                                </div>
                                <div className="pb-0.5">
                                    <EventSelection onSelect={setPaceDistance} />
                                </div>
                            </div>
                        </div>

                        <Button onClick={calculatePace} className="w-full" size="lg">
                            Calculate Pace
                        </Button>

                        {paceResult && (
                            <>
                                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Pace per {unit}</p>
                                    <p className="text-4xl font-bold text-primary">
                                        {formatPace(paceResult, unit)}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Speed: {(paceDistance / (timeToSeconds(paceDuration) / 3600)).toFixed(2)} {unit}/h
                                    </p>
                                </div>
                                <RunResultsChart
                                    distance={unit === 'km' ? paceDistance : milesToKm(paceDistance)}
                                    durationSeconds={timeToSeconds(paceDuration)}
                                />
                            </>
                        )}
                    </TabsContent>

                    {/* Distance Calculator */}
                    <TabsContent value="distance" className="space-y-6 mt-6">
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

                        <Button onClick={calculateDistance} className="w-full" size="lg">
                            Calculate Distance
                        </Button>

                        {distanceResult !== null && (
                            <>
                                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Distance</p>
                                    <p className="text-4xl font-bold text-primary">
                                        {distanceResult} {unit}
                                    </p>
                                </div>
                                <RunResultsChart
                                    distance={unit === 'km' ? distanceResult : milesToKm(distanceResult)}
                                    durationSeconds={timeToSeconds(distDuration)}
                                />
                            </>
                        )}
                    </TabsContent>

                    {/* Duration Calculator */}
                    <TabsContent value="duration" className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <div className="flex items-end justify-between gap-4">
                                <div className="space-y-2 flex-grow">
                                    <Label htmlFor="dur-distance">Distance ({unit})</Label>
                                    <Input
                                        id="dur-distance"
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={durDistance}
                                        onChange={(e) => setDurDistance(parseFloat(e.target.value) || 0)}
                                        className="text-center text-lg"
                                    />
                                </div>
                                <div className="pb-0.5">
                                    <EventSelection onSelect={setDurDistance} />
                                </div>
                            </div>
                        </div>

                        <TimeInputGroup
                            time={durPace}
                            onChange={setDurPace}
                            label={`Pace (per ${unit})`}
                        />

                        <Button onClick={calculateDuration} className="w-full" size="lg">
                            Calculate Duration
                        </Button>

                        {durationResult && (
                            <>
                                <div className="mt-6 p-6 bg-primary/10 rounded-lg text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Duration</p>
                                    <p className="text-4xl font-bold text-primary">
                                        {formatTime(durationResult)}
                                    </p>
                                </div>
                                <RunResultsChart
                                    distance={unit === 'km' ? durDistance : milesToKm(durDistance)}
                                    durationSeconds={timeToSeconds(durationResult)}
                                />
                            </>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
