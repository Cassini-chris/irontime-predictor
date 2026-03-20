'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { SteppableInput } from '@/components/ui/steppable-input';
import { TimeInputGroup } from '@/components/time-input-group';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Activity, Wind, Zap, Gauge, HeartPulse, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import AdBanner from './ad-banner';

type DistanceUnit = 'km' | 'mi';

interface Time {
    h: number;
    m: number;
    s: number;
}

const EVENTS = [
    { name: '1.5k', distance: 1.5 },
    { name: '1 mile', distance: 1.6093 },
    { name: '5k', distance: 5 },
    { name: '10k', distance: 10 },
    { name: 'Half Marathon', distance: 21.0975 },
    { name: 'Marathon', distance: 42.195 },
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

// VDOT Mathematics
const calculateVDOT = (distanceKm: number, timeMins: number) => {
    if (timeMins <= 0 || distanceKm <= 0) return 0;
    const velocity = (distanceKm * 1000) / timeMins; // m/min
    const percentVO2Max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMins) + 0.2989558 * Math.exp(-0.1932605 * timeMins);
    const vo2Cost = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
    return vo2Cost / percentVO2Max;
};

const getPaceForIntensity = (vdot: number, intensityPercent: number) => {
    if (vdot <= 0) return 0; // seconds per km
    const targetVo2 = vdot * intensityPercent;

    // quadratic: 0.000104 * v^2 + 0.182258 * v + (-4.60 - targetVo2) = 0
    const a = 0.000104;
    const b = 0.182258;
    const c = -4.60 - targetVo2;

    const velocity = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a); // m/min
    if (velocity <= 0) return 0;

    const minPerKm = 1000 / velocity;
    return minPerKm * 60; // seconds per km
};

export function TrainingPaceCalculator() {
    const [unit, setUnit] = useState<DistanceUnit>('km');
    const [duration, setDuration] = useState<Time>({ h: 0, m: 21, s: 30 });
    const [distance, setDistance] = useState<number>(5);

    const kmToMiles = (km: number) => km * 0.621371;
    const milesToKm = (mi: number) => mi / 0.621371;

    const timeToSeconds = (time: Time): number => {
        return (time.h || 0) * 3600 + (time.m || 0) * 60 + (time.s || 0);
    };

    const formatPace = (secondsPerKm: number, outUnit: DistanceUnit) => {
        let secPerUnit = secondsPerKm;
        if (outUnit === 'mi') {
            secPerUnit = secondsPerKm / 0.621371;
        }

        const m = Math.floor(secPerUnit / 60);
        const s = Math.floor(secPerUnit % 60);
        return `${m}:${String(s).padStart(2, '0')} /${outUnit}`;
    };

    const { vdot, zones } = useMemo(() => {
        const distKm = unit === 'km' ? distance : milesToKm(distance);
        const timeMins = timeToSeconds(duration) / 60;

        const calculatedVdot = calculateVDOT(distKm, timeMins);

        // Intensity percentages
        const zoneSettings = [
            { name: 'Recovery', icon: HeartPulse, percent: 0.65, color: '#3b82f6', desc: 'Active recovery, ultra easy.' },
            { name: 'Easy', icon: Wind, percent: 0.74, color: '#22c55e', desc: 'Build aerobic base.' },
            { name: 'Tempo', icon: Activity, percent: 0.88, color: '#eab308', desc: 'Lactate threshold, comfortably hard.' },
            { name: 'VO2 Max', icon: Zap, percent: 0.975, color: '#f97316', desc: 'Improve oxygen uptake (5k pace).' },
            { name: 'Speed', icon: Gauge, percent: 1.05, color: '#ef4444', desc: 'Neuromuscular speed, repetitions.' },
        ];

        const mappedZones = zoneSettings.map(z => {
            const secPerKm = getPaceForIntensity(calculatedVdot, z.percent);
            // Speed in km/h to graph
            const speedKmh = secPerKm > 0 ? 3600 / secPerKm : 0;
            return {
                ...z,
                secPerKm,
                speedKmh,
            };
        });

        return { vdot: calculatedVdot, zones: mappedZones };
    }, [distance, duration, unit]);

    return (
        <div className="space-y-12">
            <Card className="w-full shadow-xl border-t-4 border-t-accent">
                <CardHeader className="pb-4">
                    <CardTitle className="text-3xl font-black text-center tracking-tight">Recent Race/Effort</CardTitle>
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
                <CardContent className="space-y-8">
                    <TimeInputGroup
                        time={duration}
                        setTime={setDuration}
                        label="Race/Effort Duration"
                    />

                    <div className="space-y-4">
                        <Label htmlFor="race-distance" className="text-sm font-semibold text-muted-foreground uppercase tracking-wider block">Distance ({unit})</Label>
                        <div className="flex items-center gap-4">
                            <div className="flex-grow">
                                <SteppableInput
                                    id="race-distance"
                                    value={distance}
                                    onChange={setDistance}
                                    min={0.1}
                                    step={0.1}
                                    className="text-2xl h-14"
                                />
                            </div>
                            <EventSelection onSelect={setDistance} onSetUnit={setUnit} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {vdot > 0 && distance > 0 && duration.h + duration.m + duration.s > 0 && (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-3xl border shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                            <Trophy className="w-48 h-48" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground mb-4">Your VDOT Score</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-7xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent drop-shadow-sm">
                                {vdot.toFixed(1)}
                            </span>
                        </div>
                        <p className="max-w-md text-center text-muted-foreground mt-4 font-medium">
                            This score represents your running fitness. Higher is better. We use this to calculate your ideal training zones below.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-4">
                        {zones.map((zone, i) => {
                            const Icon = zone.icon;
                            let paceDisplay = formatPace(zone.secPerKm, unit);
                            return (
                                <Card key={zone.name} className="overflow-hidden hover:shadow-md transition-shadow group border-t-4" style={{ borderTopColor: zone.color }}>
                                    <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                                        <div className="p-3 rounded-full bg-muted group-hover:scale-110 transition-transform" style={{ color: zone.color, backgroundColor: `${zone.color}15` }}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-foreground">{zone.name}</h3>
                                            <p className="text-xs text-muted-foreground h-8 leading-tight mt-1">{zone.desc}</p>
                                        </div>
                                        <div className="w-full pt-4 border-t border-border">
                                            <p className="text-2xl font-black text-foreground tracking-tight">{paceDisplay}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">Speed Progression <Activity className="w-5 h-5 text-primary" /></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[350px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={zones} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                        <XAxis dataKey="name" stroke="currentColor" className="text-xs text-muted-foreground font-medium" tickLine={false} axisLine={false} />
                                        <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} tickFormatter={(val) => `${val} km/h`} />
                                        <RechartsTooltip
                                            cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    return (
                                                        <div className="bg-popover text-popover-foreground border rounded-lg p-4 shadow-lg">
                                                            <p className="font-bold text-lg mb-1">{data.name}</p>
                                                            <p className="text-sm font-medium">{formatPace(data.secPerKm, unit)} pace</p>
                                                            <p className="text-sm text-muted-foreground">{data.speedKmh.toFixed(1)} km/h</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="speedKmh" radius={[8, 8, 8, 8]}>
                                            {zones.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <AdBanner />
        </div>
    );
}
