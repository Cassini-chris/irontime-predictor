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
import { distributeGoalTime } from '@/ai/flows/distribute-goal-time';

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

  const handleDistributeTime = async () => {
    const totalSeconds = goalTime.h * 3600 + goalTime.m * 60 + goalTime.s;
    if (totalSeconds <= 0) {
      setCalculatedSplits(null);
      return;
    }

    setIsLoading(true);
    setCalculatedSplits(null);

    try {
      const { swimTime, bikeTime, runTime } = await distributeGoalTime({
        goalTime,
        distance,
        courseProfile,
        athleteBias,
      });

      // Simple transition time estimation (2.5% of total for full, scaling up)
      const transitionPercentages = { full: 0.025, half: 0.03, olympic: 0.04, sprint: 0.05 };
      const totalTransitionSeconds = totalSeconds * transitionPercentages[distance];
      const t1Seconds = Math.round(totalTransitionSeconds * 0.6);
      const t2Seconds = Math.round(totalTransitionSeconds * 0.4);
      
      const secondsToTime = (secs: number): Time => ({
        h: Math.floor(secs / 3600),
        m: Math.floor((secs % 3600) / 60),
        s: secs % 60,
      });

      const t1Time = secondsToTime(t1Seconds);
      const t2Time = secondsToTime(t2Seconds);

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
      <Card className="border-dashed bg-card/50">
        <CardHeader>
          <CardTitle>Set Your Goal</CardTitle>
          <CardDescription>
            Enter your target finish time and parameters, and let our AI coach
            create a balanced plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <TimeInputGroup label="Target Time" time={goalTime} setTime={setGoalTime} />

          <div className="space-y-2">
            <Label htmlFor="course-profile">Course Profile</Label>
            <Select
              value={courseProfile}
              onValueChange={setCourseProfile}
            >
              <SelectTrigger id="course-profile">
                <SelectValue placeholder="Select course profile" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat & Fast</SelectItem>
                <SelectItem value="rolling">Rolling Hills</SelectItem>
                <SelectItem value="hilly">Hilly</SelectItem>
                <SelectItem value="extreme">Extreme / Mountainous</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="athlete-bias">Athlete Bias</Label>
              <span className="text-xs font-medium text-muted-foreground">{biasLabel}</span>
            </div>
             <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Strong Swimmer/Biker</span>
                <Slider
                    id="athlete-bias"
                    min={0}
                    max={100}
                    step={5}
                    value={[athleteBias]}
                    onValueChange={(value) => setAthleteBias(value[0])}
                    className="flex-1"
                />
                <span>Strong Runner</span>
            </div>
          </div>

          <Button onClick={handleDistributeTime} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <SlidersHorizontal className="mr-2 h-4 w-4" />
            )}
            Generate Plan
          </Button>
        </CardContent>

        {calculatedSplits && !isLoading && (
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
