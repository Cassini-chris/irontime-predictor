'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { TimeInputGroup } from '@/components/time-input-group';
import { DistanceType, DurationWeeks, UserGoal } from '@/lib/training-plans/types';
import { generatePlan } from '@/lib/training-plans/generator';
import { calculatePaceZones, injectPaces } from '@/lib/training-plans/calculations';
import { TrainingPlanTable } from './training-plan-table';
import { Activity, Printer, Download } from 'lucide-react';
import AdBanner from './ad-banner';

interface Time {
    h: number;
    m: number;
    s: number;
}

const DISTANCES: { id: DistanceType; name: string }[] = [
    { id: '5k', name: '5K' },
    { id: '10k', name: '10K' },
    { id: 'half-marathon', name: 'Half Marathon' },
    { id: 'marathon', name: 'Marathon' },
    { id: 'ironman-70.3', name: '70.3 Ironman' },
    { id: 'ironman-full', name: 'Full Ironman' },
];

const DURATIONS: { id: DurationWeeks; name: string }[] = [
    { id: 8, name: '8 Weeks' },
    { id: 12, name: '12 Weeks' },
    { id: 16, name: '16 Weeks' },
];

export function TrainingPlansView() {
    const [distance, setDistance] = useState<DistanceType>('marathon');
    const [durationWeeks, setDurationWeeks] = useState<DurationWeeks>(12);
    const [goalTime, setGoalTime] = useState<Time>({ h: 3, m: 30, s: 0 });

    const handlePrint = () => {
        window.print();
    };

    const timeToSeconds = (time: Time): number => {
        return (time.h || 0) * 3600 + (time.m || 0) * 60 + (time.s || 0);
    };

    const { plan, zones } = useMemo(() => {
        const generatedPlan = generatePlan(distance, durationWeeks);
        const goalSeconds = timeToSeconds(goalTime);
        
        // Approximate distance float for pace calculation
        let distanceKm = 42.195;
        if (distance === '5k') distanceKm = 5;
        else if (distance === '10k') distanceKm = 10;
        else if (distance === 'half-marathon') distanceKm = 21.1;
        else if (distance === 'ironman-70.3') distanceKm = 113; // Usually VDOT for full IM isn't simple, but we can approximate a pace. Let's base it on expected run time.
        else if (distance === 'ironman-full') distanceKm = 226;

        // For triathlons, the goal time includes swim/bike, so VDOT calculation for the run part is tricky.
        // A simple hack to make run pace work: Assume the goal time entered here is the GOAL RUN SPLIT or just scale it.
        // For better accuracy, if it's a triathlon, the user should enter their run goal time. Let's add a note.
        let actualPaceCalcTime = goalSeconds;
        let actualPaceCalcDist = distanceKm;
        
        if (distance === 'ironman-70.3') {
            actualPaceCalcTime = goalSeconds * 0.35; // Rough estimate of run split (35% of total time)
            actualPaceCalcDist = 21.1;
        } else if (distance === 'ironman-full') {
            actualPaceCalcTime = goalSeconds * 0.38; // Estimate run split
            actualPaceCalcDist = 42.2;
        }

        const calculatedZones = calculatePaceZones(actualPaceCalcDist, actualPaceCalcTime);

        return { plan: generatedPlan, zones: calculatedZones };
    }, [distance, durationWeeks, goalTime]);

    return (
        <div className="space-y-8">
            <Card className="w-full shadow-xl border-t-4 border-t-accent print:hidden">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="text-primary" /> Plan Configuration
                    </CardTitle>
                    <CardDescription>
                        Select your race, duration, and target time. We'll generate a research-backed, day-by-day schedule with precise paces tailored to you.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Race Distance</Label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {DISTANCES.map((d) => (
                                    <Button
                                        key={d.id}
                                        variant={distance === d.id ? "default" : "outline"}
                                        className={distance === d.id ? "bg-primary text-primary-foreground shadow-md" : ""}
                                        onClick={() => setDistance(d.id)}
                                    >
                                        {d.name}
                                        {distance === d.id && <div className="absolute inset-0 ring-2 ring-primary ring-offset-2 rounded-md transition-all"></div>}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Plan Duration</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {DURATIONS.map((d) => (
                                    <Button
                                        key={d.id}
                                        variant={durationWeeks === d.id ? "default" : "outline"}
                                        onClick={() => setDurationWeeks(d.id)}
                                    >
                                        {d.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-8">
                        <div className="max-w-md mx-auto space-y-4">
                            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground block text-center">
                                Goal Time 
                                {distance.includes('ironman') && <span className="text-xs normal-case block mt-1 text-primary">Enter your total race goal time. We'll estimate the run split.</span>}
                            </Label>
                            <TimeInputGroup
                                time={goalTime}
                                setTime={setGoalTime}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between items-center print:hidden">
                <h2 className="text-3xl font-black tracking-tight">{distance.toUpperCase().replace('-', ' ')} - {durationWeeks} Weeks</h2>
                <Button onClick={handlePrint} variant="outline" className="gap-2 shadow-sm border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all">
                    <Printer className="w-4 h-4" /> Download PDF / Print
                </Button>
            </div>

            <div className="print-content">
                <TrainingPlanTable plan={plan} zones={zones} distance={distance} durationWeeks={durationWeeks} />
            </div>

            <AdBanner />
        </div>
    );
}
