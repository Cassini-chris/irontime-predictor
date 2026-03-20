import { WeekPlan, DurationWeeks, DistanceType } from './types';
import { buildWeek, rest, runE, runL, runT, runI, bikeE, bikeL, bikeT, swimE, swimI, brick } from './helpers';

const generateRunningWeeks = (distance: DistanceType, totalWeeks: DurationWeeks): WeekPlan[] => {
    const is5k = distance === '5k';
    const is10k = distance === '10k';
    const isHalf = distance === 'half-marathon';
    
    let baseLongDist = is5k ? 6 : (is10k ? 8 : (isHalf ? 12 : 16));
    let peakLongDist = is5k ? 12 : (is10k ? 16 : (isHalf ? 22 : 32));
    
    // Scale the long run progression over the weeks
    const longDistIncrement = (peakLongDist - baseLongDist) / Math.max(1, totalWeeks - 3); // Peak 2-3 weeks before race
    
    const weeks: WeekPlan[] = [];
    
    for (let w = 1; w <= totalWeeks; w++) {
        const isTaper = w >= totalWeeks - (isHalf || !is5k && !is10k ? 2 : 1);
        const isRaceWeek = w === totalWeeks;
        const phase = isRaceWeek ? 'Race' : (isTaper ? 'Taper' : (w <= totalWeeks / 3 ? 'Base' : 'Build'));
        
        // Calculate long run
        let longDist = isTaper ? Math.round(peakLongDist * (isRaceWeek ? 0.4 : 0.7)) : Math.min(peakLongDist, Math.round(baseLongDist + longDistIncrement * (w - 1)));
        
        // Down weeks every 4th week (unless it's a short 8-week plan where it happens less)
        if (w % 4 === 0 && !isTaper && !isRaceWeek) {
            longDist = Math.round(longDist * 0.75); // recovery week
        }

        const baseEasyDuration = is5k || is10k ? 30 : 45;
        const easyScale = w / totalWeeks;
        const easyDist1 = Math.round(baseEasyDuration + (15 * easyScale));
        const easyDist2 = Math.round(baseEasyDuration + (25 * easyScale));
        
        let intensityWorkout;
        if (is5k || is10k) {
            intensityWorkout = runI(w % 2 === 0 ? 6 : 8, is5k ? '400m' : '800m', 2);
        } else {
            intensityWorkout = runT(isHalf ? 50 : 60, isHalf ? 25 : 30);
        }

        let thursWorkout = runE(easyDist1);
        if (!isTaper && (isHalf || distance === 'marathon') && w > totalWeeks / 3) {
            thursWorkout = runT(45, 20); // secondary medium-block quality session for long distances
        }

        // Taper / Race week logic
        if (isRaceWeek) {
            weeks.push(buildWeek(w, phase, 
                rest(), 
                runE(30, 'Very light shakeout'), 
                rest(), 
                runE(20, 'Strides (4x100m) to stay sharp'), 
                rest(), 
                rest(), 
                [{ type: 'run', title: `Race Day: ${distance.toUpperCase()}`, description: `Good luck! Trust your training. Target Pace: {{Z4_PACE}}` }],
                'Race Week - Stay loose and rested'
            ));
        } else {
            weeks.push(buildWeek(w, phase,
                rest(),
                runE(easyDist1, 'Recovery pace. Keep it conversational.'),
                intensityWorkout,
                thursWorkout,
                rest(),
                runE(easyDist2, 'Aerobic maintenance.'),
                runL(longDist, 'Long slow distance. Practice hydration/nutrition.'),
                w % 4 === 0 ? 'Recovery and adaptation week' : `Building ${is5k||is10k ? 'speed and threshold' : 'endurance'}`
            ));
        }
    }
    return weeks;
}

const generateTriathlonWeeks = (distance: DistanceType, totalWeeks: DurationWeeks): WeekPlan[] => {
    const isHalf = distance === 'ironman-70.3';
    
    // Starting durations (minutes/meters)
    let longBikeMins = isHalf ? 90 : 120;
    let peakBikeMins = isHalf ? 180 : 360; // 3 hours vs 6 hours
    const bikeInc = (peakBikeMins - longBikeMins) / Math.max(1, totalWeeks - 3);

    let longRunDist = isHalf ? 10 : 16;
    let peakRunDist = isHalf ? 20 : 34;
    const runInc = (peakRunDist - longRunDist) / Math.max(1, totalWeeks - 3);
    
    const weeks: WeekPlan[] = [];
    
    for (let w = 1; w <= totalWeeks; w++) {
        const isTaper = w >= totalWeeks - 2;
        const isRaceWeek = w === totalWeeks;
        const phase = isRaceWeek ? 'Race' : (isTaper ? 'Taper' : (w <= totalWeeks / 4 ? 'Base' : 'Build'));
        
        let curBike = isTaper ? Math.round(peakBikeMins * (isRaceWeek ? 0.3 : 0.6)) : Math.min(peakBikeMins, Math.round(longBikeMins + bikeInc * (w - 1)));
        let curRun = isTaper ? Math.round(peakRunDist * (isRaceWeek ? 0.3 : 0.6)) : Math.min(peakRunDist, Math.round(longRunDist + runInc * (w - 1)));
        
        if (w % 4 === 0 && !isTaper && !isRaceWeek) {
            curBike = Math.round(curBike * 0.75);
            curRun = Math.round(curRun * 0.75);
        }

        const swimDist = w % 2 === 0 ? 2000 : 2500;
        const swimIntensity = isHalf ? '10x100m' : '5x400m';

        if (isRaceWeek) {
            weeks.push(buildWeek(w, phase,
                rest(),
                runE(30),
                swimE(1000),
                bikeE(45),
                rest(),
                rest(),
                [{ type: 'brick', title: `Race Day: ${distance.toUpperCase()}`, description: 'You made it to the start line. Execute your plan!' }],
                'Race Week - Trust the tapor'
            ));
        } else {
            const thursdayWorkout = w % 2 === 0 ? brick(60, 20) : runE(45);
            weeks.push(buildWeek(w, phase,
                rest(),
                swimI(swimDist, swimIntensity),
                runT(60, 30),
                thursdayWorkout,
                swimE(swimDist * 1.2),
                bikeL(curBike),
                runL(curRun, 'Endurance long run. Zone 2.'),
                w % 4 === 0 ? 'Recovery week' : 'Building volume and threshold power'
            ));
        }
    }
    return weeks;
}

export const generatePlan = (distance: DistanceType, durationWeeks: DurationWeeks): WeekPlan[] => {
    if (distance === '5k' || distance === '10k' || distance === 'half-marathon' || distance === 'marathon') {
        return generateRunningWeeks(distance, durationWeeks);
    } else {
        return generateTriathlonWeeks(distance, durationWeeks);
    }
};
