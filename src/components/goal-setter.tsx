'use client';

import { useState } from 'react';
import { TimeInputGroup } from './time-input-group';
import type { Time } from './iron-time-predictor';
import { Button } from './ui/button';
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
} from 'lucide-react';
import { Separator } from './ui/separator';

interface GoalSetterProps {
  distance: 'full' | 'half' | 'olympic' | 'sprint';
  setSwimTime: (time: Time) => void;
  setBikeTime: (time: Time) => void;
  setRunTime: (time: Time) => void;
  setT1Time: (time: Time) => void;
  setT2Time: (time: Time) => void;
}

const secondsToTime = (totalSeconds: number): Time => {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return { h, m, s };
};

const formatTime = (time: Time) => {
  return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(
    2,
    '0'
  )}:${String(time.s).padStart(2, '0')}`;
};

// These percentages represent the typical distribution of effort *within the three disciplines*.
// Transition times are handled separately.
const DISCIPLINE_DISTRIBUTION = {
  full: { swim: 0.12, bike: 0.55, run: 0.33 },
  half: { swim: 0.11, bike: 0.56, run: 0.33 },
  olympic: { swim: 0.15, bike: 0.5, run: 0.35 },
  sprint: { swim: 0.16, bike: 0.5, run: 0.34 },
};

// Transition times as a percentage of the total goal time. Longer races typically have proportionally shorter transitions.
const TRANSITION_PERCENTAGE = {
  full: 0.025, // ~2.5%
  half: 0.03, // ~3%
  olympic: 0.04, // ~4%
  sprint: 0.05, // ~5%
};

type CalculatedSplits = {
  swim: Time;
  t1: Time;
  bike: Time;
  t2: Time;
  run: Time;
};

export function GoalSetter({
  distance,
  setSwimTime,
  setBikeTime,
  setRunTime,
  setT1Time,
  setT2Time,
}: GoalSetterProps) {
  const [goalTime, setGoalTime] = useState<Time>({ h: 12, m: 0, s: 0 });
  const [calculatedSplits, setCalculatedSplits] =
    useState<CalculatedSplits | null>(null);

  const handleDistributeTime = () => {
    const totalSeconds = goalTime.h * 3600 + goalTime.m * 60 + goalTime.s;

    if (totalSeconds <= 0) {
      setCalculatedSplits(null);
      return;
    }

    const totalTransitionSeconds = totalSeconds * TRANSITION_PERCENTAGE[distance];
    const availableTimeForDisciplines = totalSeconds - totalTransitionSeconds;
    const disciplineSplits = DISCIPLINE_DISTRIBUTION[distance];

    // Calculate all splits with floating point precision
    const rawSplits = {
      swim: availableTimeForDisciplines * disciplineSplits.swim,
      t1: totalTransitionSeconds * 0.6,
      bike: availableTimeForDisciplines * disciplineSplits.bike,
      t2: totalTransitionSeconds * 0.4,
      run: availableTimeForDisciplines * disciplineSplits.run,
    };

    // Round each split to the nearest second
    const roundedSplitsInSeconds = {
      swim: Math.round(rawSplits.swim),
      t1: Math.round(rawSplits.t1),
      bike: Math.round(rawSplits.bike),
      t2: Math.round(rawSplits.t2),
      run: Math.round(rawSplits.run),
    };

    // Sum the rounded seconds to find any rounding difference
    const totalRoundedSeconds = Object.values(roundedSplitsInSeconds).reduce(
      (sum, s) => sum + s,
      0
    );
    const roundingDifference = totalSeconds - totalRoundedSeconds;

    // Adjust the longest discipline (run) to compensate for the rounding error
    roundedSplitsInSeconds.run += roundingDifference;

    // Convert final second values to Time objects
    const swimTime = secondsToTime(roundedSplitsInSeconds.swim);
    const t1Time = secondsToTime(roundedSplitsInSeconds.t1);
    const bikeTime = secondsToTime(roundedSplitsInSeconds.bike);
    const t2Time = secondsToTime(roundedSplitsInSeconds.t2);
    const runTime = secondsToTime(roundedSplitsInSeconds.run);


    // Update parent state to populate the main form
    setSwimTime(swimTime);
    setBikeTime(bikeTime);
    setRunTime(runTime);
    setT1Time(t1Time);
    setT2Time(t2Time);

    // Update local state for summary display
    setCalculatedSplits({
      swim: swimTime,
      t1: t1Time,
      bike: bikeTime,
      t2: t2Time,
      run: runTime,
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <Card className="border-dashed bg-card/50">
        <CardHeader>
          <CardTitle>Set Your Goal</CardTitle>
          <CardDescription>
            Enter your target finish time, and we'll create a balanced plan for
            you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <TimeInputGroup time={goalTime} setTime={setGoalTime} />
          <Button onClick={handleDistributeTime} className="w-full">
            <SlidersHorizontal className="mr-2 h-4 w-4" /> Distribute Times
          </Button>
        </CardContent>

        {calculatedSplits && (
          <>
            <Separator />
            <CardFooter className="flex flex-col items-start space-y-3 p-6 pt-4">
              <h4 className="font-medium text-lg w-full text-center mb-2">
                Suggested Splits
              </h4>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Waves className="size-5 text-primary" /> Swim
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatTime(calculatedSplits.swim)}
                </span>
              </div>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRightLeft className="size-5 text-accent" /> T1
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatTime(calculatedSplits.t1)}
                </span>
              </div>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Bike className="size-5 text-primary" /> Bike
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatTime(calculatedSplits.bike)}
                </span>
              </div>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRightLeft className="size-5 text-accent" /> T2
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatTime(calculatedSplits.t2)}
                </span>
              </div>
              <div className="w-full flex justify-between items-center text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <PersonStanding className="size-5 text-primary" /> Run
                </span>
                <span className="font-mono font-medium text-foreground">
                  {formatTime(calculatedSplits.run)}
                </span>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
