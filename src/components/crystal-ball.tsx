'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Time } from './iron-time-predictor';

interface CrystalBallProps {
  onPrediction: (times: {
    swimTime: Time;
    t1Time: Time;
    bikeTime: Time;
    t2Time: Time;
    runTime: Time;
  }) => void;
  onClose: () => void;
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

// Logic copied & adapted from GoalSetter.tsx
const distributeTime = (totalSeconds: number) => {
    const distance = 'full'; // Prediction is always for a full distance
    const TRANSITION_PERCENTAGE = 0.025; // ~2.5% for full
    const DISCIPLINE_DISTRIBUTION = { swim: 0.12, bike: 0.55, run: 0.33 };

    const totalTransitionSeconds = totalSeconds * TRANSITION_PERCENTAGE;
    const availableTimeForDisciplines = totalSeconds - totalTransitionSeconds;

    const rawSplits = {
      swim: availableTimeForDisciplines * DISCIPLINE_DISTRIBUTION.swim,
      t1: totalTransitionSeconds * 0.6,
      bike: availableTimeForDisciplines * DISCIPLINE_DISTRIBUTION.bike,
      t2: totalTransitionSeconds * 0.4,
      run: availableTimeForDisciplines * DISCIPLINE_DISTRIBUTION.run,
    };

    const roundedSplitsInSeconds = {
      swim: Math.round(rawSplits.swim),
      t1: Math.round(rawSplits.t1),
      bike: Math.round(rawSplits.bike),
      t2: Math.round(rawSplits.t2),
      run: Math.round(rawSplits.run),
    };

    const totalRoundedSeconds = Object.values(roundedSplitsInSeconds).reduce(
      (sum, s) => sum + s,
      0
    );
    const roundingDifference = totalSeconds - totalRoundedSeconds;

    roundedSplitsInSeconds.run += roundingDifference;

    return {
      swimTime: secondsToTime(roundedSplitsInSeconds.swim),
      t1Time: secondsToTime(roundedSplitsInSeconds.t1),
      bikeTime: secondsToTime(roundedSplitsInSeconds.bike),
      t2Time: secondsToTime(roundedSplitsInSeconds.t2),
      runTime: secondsToTime(roundedSplitsInSeconds.run),
    };
};

export function CrystalBall({ onPrediction, onClose }: CrystalBallProps) {
  const [status, setStatus] = useState<'idle' | 'predicting' | 'revealed'>('idle');
  const [isClosing, setIsClosing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    totalTime: Time;
  } | null>(null);

  const handlePredict = () => {
    setStatus('predicting');

    setTimeout(() => {
      const isSub10Hour = Math.random() < 0.5;
      const TEN_HOUR_SECONDS = 10 * 3600;

      let totalSeconds: number;

      if (isSub10Hour) {
        // Generate a random time between 8:30:00 and 9:59:59
        const minTime = 8.5 * 3600;
        totalSeconds = Math.floor(Math.random() * (TEN_HOUR_SECONDS - minTime) + minTime);
      } else {
        // Generate a random time between 10:00:01 and 12:00:00
        const maxTime = 12 * 3600;
        totalSeconds = Math.floor(Math.random() * (maxTime - TEN_HOUR_SECONDS) + TEN_HOUR_SECONDS + 1);
      }

      const totalTime = secondsToTime(totalSeconds);
      const distributedTimes = distributeTime(Math.floor(totalSeconds));

      setPredictionResult({ totalTime });
      
      onPrediction(distributedTimes);

      setStatus('revealed');
    }, 2500); // Simulate prediction time
  };

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    // Unmount after fade-out animation (500ms)
    setTimeout(onClose, 500); 
  };

  useEffect(() => {
    if (status === 'revealed') {
      const timer = setTimeout(handleClose, 7500); // Stay on screen for 7.5 seconds before fading
      return () => clearTimeout(timer);
    }
  }, [status, onClose]);

  return (
    <div
      onClick={status === 'revealed' ? handleClose : undefined}
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm',
        isClosing
          ? 'animate-out fade-out duration-500'
          : 'animate-in fade-in duration-500',
        status === 'revealed' && 'cursor-pointer'
      )}
    >
      <div className="text-center p-8 space-y-6">
        {status === 'idle' && (
          <div className="animate-in fade-in-0 duration-500 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">What will be your finishing time in Roth?</h2>
            <p className="text-muted-foreground text-lg">Let the crystal ball predict your race destiny.</p>
            <Button size="lg" onClick={(e) => { e.stopPropagation(); handlePredict(); } }>
              <Sparkles className="mr-2" />
              Predict My Finish Time
            </Button>
          </div>
        )}

        {status === 'predicting' && (
          <div className="animate-in fade-in-0 duration-500 space-y-6">
            <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
            <p className="text-lg text-muted-foreground animate-pulse">Consulting the oracle...</p>
          </div>
        )}

        {status === 'revealed' && predictionResult && (
           <div className="animate-in fade-in-0 zoom-in-75 duration-700 space-y-4">
            <p className="text-2xl font-medium">Your predicted finish time is:</p>
            <p className="text-6xl md:text-8xl font-bold font-mono text-primary tracking-tighter">
              {formatTime(predictionResult.totalTime)}
            </p>
            <p className="text-3xl font-bold text-accent">An amazing achievement awaits!</p>
            <p className="text-muted-foreground mt-4 text-sm animate-pulse">Click anywhere to continue</p>
          </div>
        )}
      </div>
    </div>
  );
}
