'use client';

import { WeekPlan, PaceZones, DistanceType, WorkoutType } from '@/lib/training-plans/types';
import { injectPaces } from '@/lib/training-plans/calculations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Bike, Waves, PlayCircle, Dumbbell, Coffee } from 'lucide-react';

interface Props {
    plan: WeekPlan[];
    zones: PaceZones;
    distance: DistanceType;
    durationWeeks: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TrainingPlanTable({ plan, zones, distance, durationWeeks }: Props) {
    const getIcon = (type: WorkoutType) => {
        switch (type) {
            case 'run': return <Activity className="w-4 h-4 text-blue-500" />;
            case 'bike': return <Bike className="w-4 h-4 text-green-500" />;
            case 'swim': return <Waves className="w-4 h-4 text-cyan-500" />;
            case 'brick': return <PlayCircle className="w-4 h-4 text-purple-500" />;
            case 'strength': return <Dumbbell className="w-4 h-4 text-orange-500" />;
            case 'rest': return <Coffee className="w-4 h-4 text-muted-foreground opacity-50" />;
            default: return <Activity className="w-4 h-4" />;
        }
    };

    const getTypeColor = (type: WorkoutType) => {
        switch (type) {
            case 'run': return 'bg-blue-500/10 border-blue-500/20';
            case 'bike': return 'bg-green-500/10 border-green-500/20';
            case 'swim': return 'bg-cyan-500/10 border-cyan-500/20';
            case 'brick': return 'bg-purple-500/10 border-purple-500/20';
            case 'rest': return 'bg-muted/50 border-border/50 opacity-70';
            default: return 'bg-primary/10 border-primary/20';
        }
    };

    return (
        <div className="space-y-12">
            <div className="hidden print:block mb-8 border-b pb-4">
                <h1 className="text-4xl font-black">{distance.toUpperCase().replace('-', ' ')} Training Plan</h1>
                <p className="text-xl text-muted-foreground">{durationWeeks} Weeks to Goal Day</p>
                <div className="flex gap-4 mt-4 text-sm font-medium">
                    <span className="bg-muted px-2 py-1 rounded">Easy Pace: {Math.floor(zones.easy/60)}:{String(Math.floor(zones.easy%60)).padStart(2,'0')}/km</span>
                    <span className="bg-muted px-2 py-1 rounded">Tempo Pace: {Math.floor(zones.tempo/60)}:{String(Math.floor(zones.tempo%60)).padStart(2,'0')}/km</span>
                    <span className="bg-muted px-2 py-1 rounded">Interval Pace: {Math.floor(zones.vo2max/60)}:{String(Math.floor(zones.vo2max%60)).padStart(2,'0')}/km</span>
                </div>
            </div>

            {plan.map((week) => (
                <Card key={week.weekNumber} className="w-full shadow-sm overflow-hidden break-inside-avoid print:shadow-none print:border-none print:mb-8 border-t-4 border-t-primary/20">
                    <CardHeader className="bg-muted/30 pb-4 border-b">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <span className="text-primary tracking-tight">Week {week.weekNumber}</span>
                                <span className="text-sm font-medium px-2 py-1 bg-background border rounded-full text-muted-foreground hidden sm:inline-block">
                                    Phase: {week.phase}
                                </span>
                            </CardTitle>
                            {week.focus && <CardDescription className="font-medium text-foreground m-0">{week.focus}</CardDescription>}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {/* Desktop Grid Layout */}
                        <div className="hidden lg:grid grid-cols-7 divide-x divide-border">
                            {week.days.map((day) => (
                                <div key={day.dayOfWeek} className="flex flex-col h-full min-h-[160px]">
                                    <div className="p-2 border-b bg-muted/10 text-center font-bold text-sm tracking-widest uppercase text-muted-foreground">
                                        {DAYS[day.dayOfWeek]}
                                    </div>
                                    <div className="p-3 flex-grow flex flex-col gap-2 relative">
                                        {day.workouts.map((workout, idx) => (
                                            <div key={idx} className={`p-3 rounded-lg border text-sm flex flex-col gap-2 hover:shadow-md transition-shadow h-full ${getTypeColor(workout.type)}`}>
                                                <div className="flex items-center gap-2 font-bold break-words leading-tight">
                                                    <span className="shrink-0">{getIcon(workout.type)}</span>
                                                    <span>{workout.title}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-auto leading-relaxed">
                                                    {injectPaces(workout.description, zones)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Mobile List Layout */}
                        <div className="lg:hidden divide-y divide-border">
                            {week.days.map((day) => (
                                <div key={day.dayOfWeek} className="p-4 flex flex-col gap-3">
                                    <div className="font-bold text-sm uppercase text-muted-foreground w-12 shrink-0">
                                        {DAYS[day.dayOfWeek]}
                                    </div>
                                    <div className="flex flex-col gap-2 flex-grow">
                                        {day.workouts.map((workout, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border flex flex-col gap-2 ${getTypeColor(workout.type)}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3 font-bold text-lg">
                                                        <span className="p-2 bg-background rounded-full shadow-sm">{getIcon(workout.type)}</span>
                                                        {workout.title}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground leading-relaxed pl-12">
                                                    {injectPaces(workout.description, zones)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
