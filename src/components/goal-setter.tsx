'use client';

import { useState } from 'react';
import {
  distributeGoalTime,
  type DistributeGoalTimeInput,
} from '@/ai/flows/distribute-goal-time';
import { useToast } from '@/hooks/use-toast';
import { TimeInputGroup } from './time-input-group';
import type { Time } from './iron-time-predictor';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { WandSparkles } from 'lucide-react';

interface GoalSetterProps {
  distance: DistributeGoalTimeInput['distance'];
  setSwimTime: (time: Time) => void;
  setBikeTime: (time: Time) => void;
  setRunTime: (time: Time) => void;
}

const zeroTime: Time = { h: 0, m: 0, s: 0 };

export function GoalSetter({
  distance,
  setSwimTime,
  setBikeTime,
  setRunTime,
}: GoalSetterProps) {
  const [goalTime, setGoalTime] = useState<Time>({ h: 12, m: 0, s: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDistributeTime = async () => {
    setIsLoading(true);
    try {
      const result = await distributeGoalTime({ goalTime, distance });
      if (result) {
        setSwimTime(result.swimTime);
        setBikeTime(result.bikeTime);
        setRunTime(result.runTime);
        toast({
          title: 'Times Distributed!',
          description: 'Your goal has been split into discipline times.',
        });
      } else {
        throw new Error('AI did not return a valid distribution.');
      }
    } catch (error) {
      console.error('Error distributing time:', error);
      toast({
        variant: 'destructive',
        title: 'An Error Occurred',
        description:
          'Could not generate time distribution. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-4">
        <Card className="bg-card/50 border-dashed">
            <CardHeader>
                <CardTitle>Set Your Goal</CardTitle>
                <CardDescription>Enter your target finish time, and let our AI coach create a balanced plan for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <TimeInputGroup time={goalTime} setTime={setGoalTime} />
                <Button onClick={handleDistributeTime} disabled={isLoading} className="w-full">
                    {isLoading ? 'Calculating...' : <><WandSparkles className="mr-2 h-4 w-4" /> Distribute Times with AI</>}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
