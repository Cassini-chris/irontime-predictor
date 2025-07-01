'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import { Crown } from 'lucide-react';

interface BlummenfeltComparisonProps {
  totalTime: Time;
  distance: DistanceKey;
}

const BLUMMENFELT_PBS_SECONDS = {
  full: 7 * 3600 + 25 * 60 + 57, // 7:25:57
  half: 3 * 3600 + 29 * 60 + 4, // 3:29:04
  olympic: 1 * 3600 + 45 * 60 + 4, // 1:45:04
  sprint: 54 * 60 + 47, // 0:54:47
};

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

const secondsToFormattedTime = (totalSeconds: number) => {
    return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
}

export function BlummenfeltComparison({
  totalTime,
  distance,
}: BlummenfeltComparisonProps) {
  const userTotalSeconds = timeToSeconds(totalTime);
  const blummenfeltSeconds = BLUMMENFELT_PBS_SECONDS[distance];

  const percentage =
    userTotalSeconds > 0 ? (blummenfeltSeconds / userTotalSeconds) * 100 : 0;

  const blummenfeltTime = secondsToFormattedTime(blummenfeltSeconds);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
          <Crown className="text-primary" />
          Blummenfelt-Benchmark
        </CardTitle>
        <CardDescription>
          How do you stack up against the "Norwegians"? His record for this
          distance is {blummenfeltTime}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {userTotalSeconds > 0 ? (
          <>
            <Progress value={percentage} className="h-4" />
            <p className="text-center font-medium text-lg">
              Your performance is{' '}
              <span className="font-bold text-primary">
                {percentage.toFixed(1)}%
              </span>{' '}
              of his pace.
            </p>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Enter your times to see the comparison.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
