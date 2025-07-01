'use client';

import { useState } from 'react';
import { TimeInputGroup } from './time-input-group';
import type { Time } from './iron-time-predictor';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { SlidersHorizontal } from 'lucide-react';

interface GoalSetterProps {
  distance: 'full' | 'half' | 'olympic' | 'sprint';
  setSwimTime: (time: Time) => void;
  setBikeTime: (time: Time) => void;
  setRunTime: (time: Time) => void;
}

const secondsToTime = (seconds: number): Time => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return { h, m, s };
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

export function GoalSetter({
  distance,
  setSwimTime,
  setBikeTime,
  setRunTime,
}: GoalSetterProps) {
  const [goalTime, setGoalTime] = useState<Time>({ h: 12, m: 0, s: 0 });

  const handleDistributeTime = () => {
    const totalSeconds = goalTime.h * 3600 + goalTime.m * 60 + goalTime.s;

    if (totalSeconds <= 0) {
      // Silently fail for invalid input, or add a toast notification if preferred.
      return;
    }

    const transitionTime = totalSeconds * TRANSITION_PERCENTAGE[distance];
    const availableTimeForDisciplines = totalSeconds - transitionTime;

    const disciplineSplits = DISCIPLINE_DISTRIBUTION[distance];

    const swimSeconds = availableTimeForDisciplines * disciplineSplits.swim;
    const bikeSeconds = availableTimeForDisciplines * disciplineSplits.bike;
    const runSeconds = availableTimeForDisciplines * disciplineSplits.run;

    setSwimTime(secondsToTime(swimSeconds));
    setBikeTime(secondsToTime(bikeSeconds));
    setRunTime(secondsToTime(runSeconds));
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
      </Card>
    </div>
  );
}
