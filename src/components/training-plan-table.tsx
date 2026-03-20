'use client';

import { useState, useEffect } from 'react';
import { WeekPlan, PaceZones, DistanceType, WorkoutType, UnitType, Workout } from '@/lib/training-plans/types';
import { injectPaces, formatPace } from '@/lib/training-plans/calculations';
import { analyzeWeek } from '@/lib/training-plans/validation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Bike, Waves, PlayCircle, Dumbbell, Coffee, GripVertical, AlertTriangle, CheckCircle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface Props {
    plan: WeekPlan[];
    zones: PaceZones;
    distance: DistanceType;
    durationWeeks: number;
    unit: UnitType;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function TrainingPlanTable({ plan, zones, distance, durationWeeks, unit }: Props) {
    const [localPlan, setLocalPlan] = useState<WeekPlan[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setLocalPlan(plan);
        setMounted(true);
    }, [plan]);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId === destination.droppableId) return;

        // IDs format: `week-${wIndex}-day-${dIndex}`
        const [, sWeekStr, , sDayStr] = source.droppableId.split('-');
        const [, dWeekStr, , dDayStr] = destination.droppableId.split('-');

        const sWeek = parseInt(sWeekStr);
        const sDay = parseInt(sDayStr);
        const dWeek = parseInt(dWeekStr);
        const dDay = parseInt(dDayStr);

        if (sWeek !== dWeek) return; // Disallow dragging between weeks for simplicity

        setLocalPlan(prevPlan => {
            const newPlan = JSON.parse(JSON.stringify(prevPlan)) as WeekPlan[];
            const week = newPlan[sWeek];
            const sourceDay = week.days[sDay];
            const destDay = week.days[dDay];

            const [movedItem] = sourceDay.workouts.splice(source.index, 1);

            // Insert into destination at the exact index, or append if destination is empty (rest day placeholder logic)
            destDay.workouts.splice(destination.index, 0, movedItem);

            return newPlan;
        });
    };

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

    const formatWorkoutTitle = (workout: Workout, unit: UnitType) => {
        if (unit === 'metric') return workout.title;
        
        // Simple heuristic: if it has "kilometers", convert to miles
        let newTitle = workout.title;
        if (workout.distanceKm) {
            const miles = (workout.distanceKm / 1.60934).toFixed(1);
            newTitle = newTitle.replace(`${workout.distanceKm} kilometers`, `${miles} miles`);
        }
        return newTitle;
    };

    if (!mounted) return null; // Prevent hydration mismatch on DnD

    return (
        <DragDropContext onDragEnd={handleDragEnd} key={`${distance}-${durationWeeks}-${unit}`}>
            <div className="space-y-12">
                <div className="hidden print:block mb-8 border-b pb-4">
                    <h1 className="text-4xl font-black">{distance.toUpperCase().replace('-', ' ')} Training Plan</h1>
                    <p className="text-xl text-muted-foreground">{durationWeeks} Weeks to Goal Day</p>
                    <div className="flex gap-4 mt-4 text-sm font-medium">
                        <span className="bg-muted px-2 py-1 rounded">Easy Pace: {formatPace(zones.easy, unit)}</span>
                        <span className="bg-muted px-2 py-1 rounded">Tempo Pace: {formatPace(zones.tempo, unit)}</span>
                        <span className="bg-muted px-2 py-1 rounded">Interval Pace: {formatPace(zones.vo2max, unit)}</span>
                    </div>
                </div>

                {localPlan.map((week, wIndex) => {
                    const health = analyzeWeek(week);

                    return (
                        <Card key={week.weekNumber} className="w-full shadow-lg overflow-hidden break-inside-avoid print:shadow-none print:border-none print:mb-8 border-t-4 border-t-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex flex-col">
                                        <CardTitle className="text-xl font-black flex items-center gap-3">
                                            <span className="text-primary tracking-tight bg-primary/10 px-3 py-1 rounded-lg">Week {week.weekNumber}</span>
                                            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-background border rounded-full text-muted-foreground hidden sm:inline-block">
                                                {week.phase}
                                            </span>
                                        </CardTitle>
                                        {week.focus && <CardDescription className="font-bold text-foreground/80 m-0 mt-2 text-sm uppercase tracking-wide">{week.focus}</CardDescription>}
                                    </div>
                                    <div className="flex flex-col items-end gap-1 text-right">
                                        <div className="flex items-center gap-2">
                                            {health.score < 80 ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
                                            <span className="font-black text-sm uppercase tracking-tighter">Week Score: <span className={health.score < 80 ? 'text-amber-500' : 'text-green-500'}>{health.score}</span></span>
                                        </div>
                                        {health.warnings.length > 0 && <span className="text-[10px] text-amber-600 font-bold uppercase tracking-tight max-w-xs">{health.warnings[0]}</span>}
                                        {health.warnings.length === 0 && health.tips.length > 0 && <span className="text-[10px] text-green-600 font-bold uppercase tracking-tight">{health.tips[0]}</span>}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 select-none overflow-x-auto no-scrollbar scrollbar-hide print:overflow-visible print:px-2">
                                {/* Grid Layout (Responsive) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 lg:divide-x divide-border w-full min-w-[300px] lg:min-w-[1200px] print:min-w-0 print:grid-cols-2 print:sm:grid-cols-3 print:divide-x-0 print:divide-y-0 print:gap-4 print:py-4">
                                    {week.days.map((day, dIndex) => (
                                        <Droppable key={day.dayOfWeek} droppableId={`week-${wIndex}-day-${dIndex}`}>
                                            {(provided, snapshot) => (
                                                <div 
                                                    ref={provided.innerRef} 
                                                    {...provided.droppableProps}
                                                    className={`flex flex-col h-full min-h-[160px] transition-colors border-b lg:border-b-0 print:border print:rounded-xl print:min-h-0 print:shadow-sm ${snapshot.isDraggingOver ? 'bg-primary/5 ring-inset ring-2 ring-primary/20' : ''}`}
                                                >
                                                    <div className="p-2 border-b bg-muted/10 text-center font-bold text-sm tracking-widest uppercase text-muted-foreground print:bg-muted/30 print:border-b print:rounded-t-xl print:text-xs">
                                                        {DAYS[day.dayOfWeek]}
                                                    </div>
                                                    <div className="p-3 flex-grow flex flex-col gap-2 relative">
                                                        {day.workouts.map((workout, idx) => (
                                                            <Draggable key={`${week.weekNumber}-${day.dayOfWeek}-${idx}`} draggableId={`${week.weekNumber}-${day.dayOfWeek}-${idx}`} index={idx}>
                                                                {(provided, snapshot) => (
                                                                    <div 
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        className={`p-3 rounded-lg border text-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative print:break-inside-avoid print:shadow-none ${getTypeColor(workout.type)} ${snapshot.isDragging ? 'shadow-xl scale-105 z-50 ring-2 ring-primary' : ''}`}
                                                                    >
                                                                        <div className="flex items-start justify-between gap-1 font-bold break-words leading-tight">
                                                                            <span className="flex items-center gap-2 mt-0.5"><span className="shrink-0">{getIcon(workout.type)}</span><span>{formatWorkoutTitle(workout, unit)}</span></span>
                                                                            <div {...provided.dragHandleProps} className="text-muted-foreground/50 hover:text-foreground shrink-0 cursor-grab active:cursor-grabbing p-1 -mr-2 -mt-2 touch-none print:hidden">
                                                                                <GripVertical className="w-4 h-4" />
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-muted-foreground mt-auto leading-relaxed">
                                                                            {injectPaces(workout.description, zones, unit)}
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        {day.workouts.length === 0 && !snapshot.isDraggingOver && (
                                                            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground/40 italic pointer-events-none">
                                                                Rest Day
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </Droppable>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </DragDropContext>
    );
}

