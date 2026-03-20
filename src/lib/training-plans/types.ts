export type DistanceType = '5k' | '10k' | 'half-marathon' | 'marathon' | 'ironman-70.3' | 'ironman-full';
export type DurationWeeks = 8 | 12 | 16;
export type WorkoutType = 'run' | 'bike' | 'swim' | 'strength' | 'rest' | 'brick' | 'cross-train';
export type UnitType = 'metric' | 'imperial';

export interface Workout {
    type: WorkoutType;
    title: string;
    durationMinutes?: number;
    distanceKm?: number;
    description: string; // May contain template variables like {{Z2_PACE}}, {{Z4_PACE}}
}

export interface DayPlan {
    dayOfWeek: number; // 0 = Monday, 6 = Sunday for display purposes
    workouts: Workout[];
}

export interface WeekPlan {
    weekNumber: number;
    phase: 'Base' | 'Build' | 'Peak' | 'Taper' | 'Race';
    days: DayPlan[];
    focus?: string;
}

export interface TrainingPlanTemplate {
    id: string;
    distance: DistanceType;
    durationWeeks: DurationWeeks;
    title: string;
    description: string;
    weeks: WeekPlan[];
}

export interface UserGoal {
    timeSeconds: number; // The user's goal time for the event
}

export interface PaceZones {
    recovery: number; // seconds per km
    easy: number;
    tempo: number;
    threshold: number;
    vo2max: number;
    speed: number;
}
