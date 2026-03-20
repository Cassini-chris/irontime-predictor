import { WeekPlan, Workout, DayPlan } from './types';

// Helper to quickly build a week
export const buildWeek = (
    weekNumber: number,
    phase: WeekPlan['phase'],
    monday: Workout[],
    tuesday: Workout[],
    wednesday: Workout[],
    thursday: Workout[],
    friday: Workout[],
    saturday: Workout[],
    sunday: Workout[],
    focus: string = ''
): WeekPlan => {
    return {
        weekNumber,
        phase,
        focus,
        days: [
            { dayOfWeek: 0, workouts: monday },
            { dayOfWeek: 1, workouts: tuesday },
            { dayOfWeek: 2, workouts: wednesday },
            { dayOfWeek: 3, workouts: thursday },
            { dayOfWeek: 4, workouts: friday },
            { dayOfWeek: 5, workouts: saturday },
            { dayOfWeek: 6, workouts: sunday },
        ]
    }
};

export const rest = (): Workout[] => [{ type: 'rest', title: 'Rest Day', description: 'Focus on recovery, hydration, and stretching.' }];
export const runE = (mins: number, desc = 'Easy aerobic pace. You should be able to hold a conversation.'): Workout[] => [{ type: 'run', title: `Easy Run (${mins}m)`, durationMinutes: mins, description: `Pace: {{Z2_PACE}}. ${desc}` }];
export const runL = (distance: number, desc = 'Long endurance run.'): Workout[] => [{ type: 'run', title: `Long Run (${distance}km)`, distanceKm: distance, description: `Pace: {{Z2_PACE}}. ${desc}` }];
export const runT = (minsTotal: number, minsTempo: number): Workout[] => [{ type: 'run', title: `Tempo Run (${minsTotal}m)`, durationMinutes: minsTotal, description: `Warm up 15m. Run ${minsTempo}m at Tempo pace ({{Z3_PACE}}). Cool down 15m.` }];
export const runI = (reps: number, dist: string, restMins: number): Workout[] => [{ type: 'run', title: `Intervals (${reps}x${dist})`, description: `Warm up 15m. ${reps}x${dist} at Interval pace ({{Z5_PACE}}) with ${restMins}m jogging recovery. Cool down 10m.` }];

export const bikeE = (mins: number): Workout[] => [{ type: 'bike', title: `Easy Ride (${mins}m)`, durationMinutes: mins, description: `Easy aerobic spin, Zone 2.` }];
export const bikeL = (mins: number): Workout[] => [{ type: 'bike', title: `Long Ride (${Math.floor(mins/60)}h ${mins%60}m)`, durationMinutes: mins, description: `Endurance pace, Zone 2. Fuel consistently.` }];
export const bikeT = (minsTotal: number, reps: number, repMins: number): Workout[] => [{ type: 'bike', title: `Threshold Ride (${minsTotal}m)`, durationMinutes: minsTotal, description: `Warm up 20m. ${reps}x${repMins}m at Tempo/Threshold effort (Zone 3/4) with 5m easy spin between. Cool down.` }];

export const swimE = (meters: number): Workout[] => [{ type: 'swim', title: `Endurance Swim (${meters}m)`, description: `Continuous or broken aerobic swimming. E.g. ${meters/100}x100m with 15s rest, moderate effort.` }];
export const swimI = (totalMeters: number, coreS: string): Workout[] => [{ type: 'swim', title: `Interval Swim (${totalMeters}m)`, description: `Warm up 400m. Main set: ${coreS} at hard effort. Cool down 200m.` }];

export const brick = (bikeMins: number, runMins: number): Workout[] => [{ type: 'brick', title: `Brick Workout`, description: `Ride ${bikeMins}m in Zone 2/3, then immediately transition to a ${runMins}m run at race pace ({{Z3_PACE}}). practice your T2.` }];

