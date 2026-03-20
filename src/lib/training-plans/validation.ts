import { WeekPlan, DayPlan, WorkoutType } from './types';

export interface WeekScore {
    score: number; // 0 to 100
    warnings: string[];
    tips: string[];
}

export const analyzeWeek = (week: WeekPlan): WeekScore => {
    let score = 100;
    const warnings: string[] = [];
    const tips: string[] = [];

    const days = week.days.sort((a, b) => a.dayOfWeek - b.dayOfWeek);

    let restDaysCount = 0;
    let consecutiveRestDays = 0;
    let highIntensityCount = 0;
    
    const isHighIntensity = (type: WorkoutType) => type === 'run' || type === 'bike' || type === 'brick' || type === 'swim'; // simplification
    
    // We analyze the exact workouts per day
    for (let i = 0; i < days.length; i++) {
        const today = days[i];
        
        const isRestDay = today.workouts.length === 0 || today.workouts.every(w => w.type === 'rest');
        const hasHardRun = today.workouts.some(w => w.type === 'run' && (w.title.includes('Intervals') || w.title.includes('Tempo')));
        const hasLongSession = today.workouts.some(w => w.title.includes('Long'));
        
        if (isRestDay) {
            restDaysCount++;
            consecutiveRestDays++;
            
            if (consecutiveRestDays > 1) {
                // Warning for multiple rest days in a row generally unless tapering
                if (week.phase !== 'Taper' && week.phase !== 'Race') {
                    score -= 10;
                    if (!warnings.includes('Not recommended: Consecutive rest days.')) {
                        warnings.push('Not recommended: Consecutive rest days.');
                    }
                }
            }
            highIntensityCount = 0; // reset
        } else {
            consecutiveRestDays = 0;
            if (hasHardRun || hasLongSession) {
                highIntensityCount++;
                if (highIntensityCount > 2) {
                    score -= 15;
                    warnings.push('High injury risk: 3+ hard/long days in a row. Add a rest or easy recovery day.');
                }
            } else {
                highIntensityCount = 0;
            }
        }

        // Check back-to-back long/hard
        if (i > 0) {
            const yesterday = days[i - 1];
            const yestHard = yesterday.workouts.some(w => w.type === 'run' && (w.title.includes('Intervals') || w.title.includes('Tempo') || w.title.includes('Long')));
            if (yestHard && (hasHardRun || hasLongSession)) {
                score -= 5;
                tips.push(`Day ${i+1}: Consider separating hard/long sessions with a recovery day.`);
            }
        }
    }

    if (restDaysCount === 0) {
        score -= 20;
        warnings.push('Critical: No rest days scheduled this week. Overtraining risk.');
    } else if (restDaysCount > 3 && week.phase !== 'Race') {
        score -= 10;
        warnings.push('Too many rest days might hinder progress.');
    }

    if (score === 100) {
        tips.push('Excellent balance of intensity and recovery.');
    }

    return {
        score: Math.max(0, score),
        warnings,
        tips: [...new Set(tips)].slice(0, 2) // Max 2 tips
    };
};
