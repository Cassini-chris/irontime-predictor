'use client';

import { useState, useEffect } from 'react';
import { TimeInputGroup } from './time-input-group';
import type { Time } from './iron-time-predictor';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  SlidersHorizontal,
  Waves,
  Bike,
  PersonStanding,
  ArrowRightLeft,
  Loader2,
} from 'lucide-react';
import { Separator } from './ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { useToast } from '@/hooks/use-toast';

interface GoalSetterProps {
  distance: 'full' | 'half' | 'olympic' | 'sprint';
  setSwimTime: (time: Time) => void;
  setBikeTime: (time: Time) => void;
  setRunTime: (time: Time) => void;
  setT1Time: (time: Time) => void;
  setT2Time: (time: Time) => void;
  setMainMode: (mode: 'manual' | 'goal') => void;
}

const formatTime = (time: Time) => {
  return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(
    2,
    '0'
  )}:${String(time.s).padStart(2, '0')}`;
};

type CalculatedSplits = {
  swim: Time;
  t1: Time;
  bike: Time;
  t2: Time;
  run: Time;
};

const secondsToTime = (secs: number): Time => {
  const roundedSecs = Math.max(0, Math.round(secs));
  return {
    h: Math.floor(roundedSecs / 3600),
    m: Math.floor((roundedSecs % 3600) / 60),
    s: roundedSecs % 60,
  };
};

const distributeGoalTimeStatistically = (
  goalTime: Time,
  distance: 'full' | 'half' | 'olympic' | 'sprint',
  courseProfile: string,
  athleteBias: number
): { swimTime: Time; bikeTime: Time; runTime: Time; t1Time: Time; t2Time: Time } => {
  const totalSeconds = goalTime.h * 3600 + goalTime.m * 60 + goalTime.s;

  const transitionPercentages = { full: 0.025, half: 0.03, olympic: 0.04, sprint: 0.05 };
  let t1Seconds = 0;
  let t2Seconds = 0;

  if (distance === 'full') {
    // Benchmark Interpolation
    // Pro (Sub-9h): T1 ~ 2:45 (165s), T2 ~ 2:00 (120s)
    // Avg (12h): T1 ~ 5:15 (315s), T2 ~ 4:15 (255s)
    // Slow (16h+): T1 ~ 10:00 (600s), T2 ~ 8:00 (480s)

    const proTime = 9 * 3600;
    const avgTime = 12 * 3600;
    const slowTime = 16 * 3600;

    if (totalSeconds <= proTime) {
      t1Seconds = 165;
      t2Seconds = 120;
    } else if (totalSeconds <= avgTime) {
      // 9h - 12h interpolation
      const ratio = (totalSeconds - proTime) / (avgTime - proTime);
      t1Seconds = 165 + (315 - 165) * ratio;
      t2Seconds = 120 + (255 - 120) * ratio;
    } else if (totalSeconds <= slowTime) {
      // 12h - 16h interpolation
      const ratio = (totalSeconds - avgTime) / (slowTime - avgTime);
      t1Seconds = 315 + (600 - 315) * ratio;
      t2Seconds = 255 + (480 - 255) * ratio;
    } else {
      // 16h+ (Slow)
      t1Seconds = 600;
      t2Seconds = 480;
    }
  } else {
    // Standard percentage based for other distances
    let totalTransitionSeconds = totalSeconds * transitionPercentages[distance];
    t1Seconds = totalTransitionSeconds * 0.6;
    t2Seconds = totalTransitionSeconds * 0.4;
  }

  const totalTransitionSeconds = t1Seconds + t2Seconds;

  const availableTime = totalSeconds - totalTransitionSeconds;

  const baseSplits = { full: { swim: 0.11, bike: 0.53, run: 0.36 }, half: { swim: 0.10, bike: 0.52, run: 0.38 }, olympic: { swim: 0.15, bike: 0.50, run: 0.35 }, sprint: { swim: 0.15, bike: 0.50, run: 0.35 } };
  let { swim, bike, run } = baseSplits[distance];

  const courseModifiers: { [key: string]: { bike: number, run: number } } = { flat: { bike: -0.03, run: -0.01 }, rolling: { bike: 0, run: 0 }, hilly: { bike: 0.03, run: 0.01 }, extreme: { bike: 0.05, run: 0.02 } };
  bike += courseModifiers[courseProfile].bike;
  run += courseModifiers[courseProfile].run;
  swim = 1 - bike - run;

  const bias = (athleteBias - 50) / 50; // -1 (swim/bike) to +1 (run)
  const biasModifier = Math.min(swim, bike, run) * 0.2;
  if (bias < 0) { // Stronger swim/biker
    run += biasModifier * Math.abs(bias);
    bike -= (biasModifier * Math.abs(bias)) * 0.5;
    swim -= (biasModifier * Math.abs(bias)) * 0.5;
  } else { // Stronger runner
    run -= biasModifier * bias;
    bike += (biasModifier * bias) * 0.5;
    swim += (biasModifier * bias) * 0.5;
  }
  const total = swim + bike + run;
  swim /= total;
  bike /= total;
  run /= total;

  const swimSeconds = availableTime * swim;
  const bikeSeconds = availableTime * bike;
  const runSeconds = availableTime * run;

  return {
    swimTime: secondsToTime(swimSeconds),
    bikeTime: secondsToTime(bikeSeconds),
    runTime: secondsToTime(runSeconds),
    t1Time: secondsToTime(t1Seconds),
    t2Time: secondsToTime(t2Seconds),
  };
};

const DISTANCE_RANGES = {
  full: { min: 25199, max: 17 * 3600, step: 15 * 60, default: 12 * 3600 }, // Min approx 6:59:59
  half: { min: 3.5 * 3600, max: 8 * 3600, step: 10 * 60, default: 5.5 * 3600 },
  olympic: { min: 1.5 * 3600, max: 4 * 3600, step: 5 * 60, default: 2.5 * 3600 },
  sprint: { min: 45 * 60, max: 2 * 3600, step: 2 * 60, default: 1.25 * 3600 },
};


export function GoalSetter({
  distance,
  setSwimTime,
  setBikeTime,
  setRunTime,
  setT1Time,
  setT2Time,
  setMainMode,
}: GoalSetterProps) {
  const [goalTime, setGoalTime] = useState<Time>({ h: 12, m: 0, s: 0 });
  const [calculatedSplits, setCalculatedSplits] =
    useState<CalculatedSplits | null>(null);
  const [courseProfile, setCourseProfile] = useState<string>('rolling');
  const [athleteBias, setAthleteBias] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

  const { min, max, step, default: defaultTime } = DISTANCE_RANGES[distance];

  useEffect(() => {
    setGoalTime(secondsToTime(defaultTime));
  }, [distance, defaultTime]);


  const handleDistributeTime = () => {
    const totalSeconds = goalTime.h * 3600 + goalTime.m * 60 + goalTime.s;
    if (totalSeconds <= 0) {
      setCalculatedSplits(null);
      return;
    }

    setIsLoading(true);
    setCalculatedSplits(null);

    try {
      const { swimTime, bikeTime, runTime, t1Time, t2Time } = distributeGoalTimeStatistically(
        goalTime,
        distance,
        courseProfile,
        athleteBias,
      );

      setSwimTime(swimTime);
      setBikeTime(bikeTime);
      setRunTime(runTime);
      setT1Time(t1Time);
      setT2Time(t2Time);

      setCalculatedSplits({
        swim: swimTime,
        bike: bikeTime,
        run: runTime,
        t1: t1Time,
        t2: t2Time,
      });

      // Switch back to manual input tab to show results
      toast({
        title: 'Plan Generated!',
        description: 'Your new time splits have been populated.',
      });
      setMainMode('manual');

    } catch (error) {
      console.error('Error distributing time:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Could not generate splits. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const biasLabel =
    athleteBias === 50
      ? 'Balanced'
      : athleteBias < 50
        ? `Swim-Bike Focus`
        : `Run Focus`;

  return (
    <div className="space-y-6 pt-4">
    <div className="space-y-8 pb-8">
      <div className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-6 rounded-2xl bg-primary/5 p-6 md:p-8 border border-primary/10 shadow-inner group">
            <Label htmlFor="goal-time-slider" className="text-center block w-full text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
              Expected Finish Time
            </Label>
            <p className="text-center font-mono text-6xl md:text-7xl font-black text-primary tracking-tighter py-4 hover:scale-105 transition-transform duration-500">
              {formatTime(goalTime)}
            </p>
            <Slider
              id="goal-time-slider"
              min={min}
              max={max}
              step={step}
              value={[timeToSeconds(goalTime)]}
              onValueChange={(value) => setGoalTime(secondsToTime(value[0]))}
              className="my-6"
            />
          </div>

          <div className="bg-muted/20 p-6 rounded-2xl border border-border/50">
            <TimeInputGroup label="Refine Target Time Manually" time={goalTime} setTime={setGoalTime} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="course-profile" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 pl-1">Course Profile</Label>
              <Select
                value={courseProfile}
                onValueChange={setCourseProfile}
              >
                <SelectTrigger id="course-profile" className="h-12 rounded-xl bg-background/50 border-primary/10 transition-all hover:border-primary/50">
                  <SelectValue placeholder="Select course profile" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-primary/10">
                  <SelectItem value="flat">Flat & Fast</SelectItem>
                  <SelectItem value="rolling">Rolling Hills</SelectItem>
                  <SelectItem value="hilly">Hilly</SelectItem>
                  <SelectItem value="extreme">Extreme / Mountainous</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center pl-1">
                <Label htmlFor="athlete-bias" className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">Athlete Bias</Label>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{biasLabel}</span>
              </div>
              <div className="flex flex-col gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 sm:flex-row sm:items-center sm:gap-6 pt-2">
                <div className="flex justify-between w-full sm:w-auto sm:contents">
                  <span className="shrink-0">Swim/Bike</span>
                  <span className="sm:hidden text-right">Runner</span>
                </div>
                <Slider
                  id="athlete-bias"
                  min={0}
                  max={100}
                  step={5}
                  value={[athleteBias]}
                  onValueChange={(value) => setAthleteBias(value[0])}
                  className="flex-1"
                />
                <span className="hidden sm:block shrink-0">Runner</span>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleDistributeTime} 
            className="w-full h-14 rounded-2xl text-base font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 active:scale-[0.98]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            ) : (
              <SlidersHorizontal className="mr-3 h-5 w-5" />
            )}
            {isLoading ? 'Engineering...' : 'Apply Strategy'}
          </Button>
        </div>

        {calculatedSplits && !isLoading && (
          <div className="flex flex-col items-start space-y-4 p-8 rounded-2xl bg-primary/5 border border-primary/10 animate-in fade-in zoom-in duration-500">
            <h4 className="font-black text-xs uppercase tracking-[0.3em] w-full text-center text-primary mb-2">
              Statistically Derived Splits
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 w-full gap-4">
              {[
                { label: 'Swim', icon: Waves, time: calculatedSplits.swim, color: 'text-primary' },
                { label: 'T1', icon: ArrowRightLeft, time: calculatedSplits.t1, color: 'text-accent' },
                { label: 'Bike', icon: Bike, time: calculatedSplits.bike, color: 'text-primary' },
                { label: 'T2', icon: ArrowRightLeft, time: calculatedSplits.t2, color: 'text-accent' },
                { label: 'Run', icon: PersonStanding, time: calculatedSplits.run, color: 'text-primary' },
              ].map((split) => (
                <div key={split.label} className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
                  <split.icon className={cn("size-5 mb-2", split.color)} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{split.label}</span>
                  <span className="font-mono font-bold text-foreground">{formatTime(split.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
