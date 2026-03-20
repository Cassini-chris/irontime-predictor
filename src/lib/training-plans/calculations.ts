import { PaceZones, UnitType } from './types';

// VDOT Mathematics (derived from training-pace-calculator.tsx)
export const calculateVDOT = (distanceKm: number, timeMins: number) => {
    if (timeMins <= 0 || distanceKm <= 0) return 0;
    const velocity = (distanceKm * 1000) / timeMins; // m/min
    const percentVO2Max = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMins) + 0.2989558 * Math.exp(-0.1932605 * timeMins);
    const vo2Cost = -4.60 + 0.182258 * velocity + 0.000104 * Math.pow(velocity, 2);
    return vo2Cost / percentVO2Max;
};

export const getPaceForIntensity = (vdot: number, intensityPercent: number) => {
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

export const formatPace = (secondsPerKm: number, unit: UnitType = 'metric') => {
    if (secondsPerKm <= 0) return 'N/A';
    
    let secondsPerUnit = secondsPerKm;
    let unitLabel = 'km';
    
    if (unit === 'imperial') {
        secondsPerUnit = secondsPerKm * 1.60934;
        unitLabel = 'mile';
    }

    const m = Math.floor(secondsPerUnit / 60);
    const s = Math.floor(secondsPerUnit % 60);
    return `${m}:${String(s).padStart(2, '0')}/${unitLabel}`;
};

export const calculatePaceZones = (distanceKm: number, goalTimeSeconds: number): PaceZones => {
    const vdot = calculateVDOT(distanceKm, goalTimeSeconds / 60);
    // Standard percentages roughly mapped to VDOT formulas
    return {
        recovery: getPaceForIntensity(vdot, 0.65),
        easy: getPaceForIntensity(vdot, 0.74),
        tempo: getPaceForIntensity(vdot, 0.88),
        threshold: getPaceForIntensity(vdot, 0.90), // Usually around aerobic threshold
        vo2max: getPaceForIntensity(vdot, 0.975),
        speed: getPaceForIntensity(vdot, 1.05),
    };
};

export const injectPaces = (description: string, zones: PaceZones, unit: UnitType = 'metric'): string => {
    return description
        .replace(/\{\{Z1_PACE\}\}/g, formatPace(zones.recovery, unit))
        .replace(/\{\{Z2_PACE\}\}/g, formatPace(zones.easy, unit))
        .replace(/\{\{Z3_PACE\}\}/g, formatPace(zones.tempo, unit))
        .replace(/\{\{Z4_PACE\}\}/g, formatPace(zones.threshold, unit))
        .replace(/\{\{Z5_PACE\}\}/g, formatPace(zones.vo2max, unit))
        .replace(/\{\{SPEED_PACE\}\}/g, formatPace(zones.speed, unit));
};
