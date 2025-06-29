'use client';

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TimeInputGroup } from '@/components/time-input-group';
import { getPerformanceInsights } from '@/ai/flows/performance-insights';
import { useToast } from '@/hooks/use-toast';
import {
  Waves,
  Bike,
  PersonStanding,
  ArrowRightLeft,
  BrainCircuit,
  Share2,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type Time = { h: number; m: number; s: number };
const zeroTime: Time = { h: 0, m: 0, s: 0 };

export function IronTimePredictor() {
  const [swimTime, setSwimTime] = useState<Time>(zeroTime);
  const [t1Time, setT1Time] = useState<Time>(zeroTime);
  const [bikeTime, setBikeTime] = useState<Time>(zeroTime);
  const [t2Time, setT2Time] = useState<Time>(zeroTime);
  const [runTime, setRunTime] = useState<Time>(zeroTime);

  const [totalTime, setTotalTime] = useState<Time>(zeroTime);
  const [insight, setInsight] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

  const secondsToTime = (seconds: number): Time => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return { h, m, s };
  };

  useEffect(() => {
    const totalSeconds =
      timeToSeconds(swimTime) +
      timeToSeconds(t1Time) +
      timeToSeconds(bikeTime) +
      timeToSeconds(t2Time) +
      timeToSeconds(runTime);
    setTotalTime(secondsToTime(totalSeconds));
  }, [swimTime, t1Time, bikeTime, t2Time, runTime]);

  const formatTime = (time: Time) => {
    return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(
      2,
      '0'
    )}:${String(time.s).padStart(2, '0')}`;
  };

  const handleGetInsight = () => {
    setError(null);
    setInsight('');
    startTransition(async () => {
      const timeToMinutes = (time: Time) => time.h * 60 + time.m + time.s / 60;
      const input = {
        swimTime: timeToMinutes(swimTime),
        bikeTime: timeToMinutes(bikeTime),
        runTime: timeToMinutes(runTime),
        t1Time: timeToMinutes(t1Time),
        t2Time: timeToMinutes(t2Time),
      };

      if (Object.values(input).every((val) => val === 0)) {
        setError('Please enter some times to get an insight.');
        return;
      }

      try {
        const result = await getPerformanceInsights(input);
        setInsight(result.insight);
      } catch (e) {
        console.error(e);
        setError('Could not generate insight. Please try again later.');
        toast({
          variant: 'destructive',
          title: 'AI Insight Error',
          description: 'There was a problem getting your performance insight.',
        });
      }
    });
  };

  const handleShare = () => {
    const shareText =
      `My Predicted Ironman Time: ${formatTime(totalTime)}\n\n` +
      `Swim: ${formatTime(swimTime)}\n` +
      `T1: ${formatTime(t1Time)}\n` +
      `Bike: ${formatTime(bikeTime)}\n` +
      `T2: ${formatTime(t2Time)}\n` +
      `Run: ${formatTime(runTime)}\n\n` +
      (insight
        ? `AI Insight: ${insight}`
        : 'Get your own prediction at IronTime Predictor!');

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: 'Copied to clipboard!',
          description: 'Your results are ready to be shared.',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast({
          variant: 'destructive',
          title: 'Failed to copy',
          description: 'Could not copy results to clipboard.',
        });
      });
  };

  const isTotalTimeZero =
    totalTime.h === 0 && totalTime.m === 0 && totalTime.s === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
      <Card className="lg:col-span-3 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-headline tracking-tight">
            Time Entry
          </CardTitle>
          <CardDescription>
            Enter your estimated times for each discipline.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-6 flex-grow">
          <TimeInputGroup
            label="Swim"
            icon={<Waves className="text-primary" />}
            time={swimTime}
            setTime={setSwimTime}
          />
          <TimeInputGroup
            label="Transition 1"
            icon={<ArrowRightLeft className="text-accent" />}
            time={t1Time}
            setTime={setT1Time}
          />
          <TimeInputGroup
            label="Bike"
            icon={<Bike className="text-primary" />}
            time={bikeTime}
            setTime={setBikeTime}
          />
          <TimeInputGroup
            label="Transition 2"
            icon={<ArrowRightLeft className="text-accent" />}
            time={t2Time}
            setTime={setT2Time}
          />
          <div className="sm:col-span-2 flex justify-center">
            <TimeInputGroup
              label="Run"
              icon={<PersonStanding className="text-primary" />}
              time={runTime}
              setTime={setRunTime}
            />
          </div>
        </CardContent>
        <div className="mt-auto">
          <Image
            src="https://placehold.co/800x400.png"
            alt="Triathlete swimming in open water"
            data-ai-hint="triathlon swimming"
            width={800}
            height={400}
            className="w-full h-auto object-cover"
          />
        </div>
      </Card>

      <div className="lg:col-span-2 space-y-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl font-headline tracking-tight">
              Predicted Total Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl md:text-7xl font-bold font-mono text-primary tracking-tighter text-center py-4">
              {formatTime(totalTime)}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline tracking-tight">
              <BrainCircuit className="text-accent" />
              Performance Insight
            </CardTitle>
            <CardDescription>
              Let AI analyze your splits for improvement tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Button
              onClick={handleGetInsight}
              disabled={isPending || isTotalTimeZero}
              className="w-full bg-accent hover:bg-accent/90"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                'Get AI Insight'
              )}
            </Button>
            {isPending && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Analyzing your performance...
              </p>
            )}
            {error && (
              <p className="text-sm text-destructive flex items-center justify-center gap-2">
                <AlertCircle size={16} /> {error}
              </p>
            )}
            {insight && (
              <p className="text-sm text-foreground bg-primary/10 p-3 rounded-md">
                {insight}
              </p>
            )}
          </CardContent>
          <div className="px-6 pb-6">
            <Button
              onClick={handleShare}
              disabled={isTotalTimeZero}
              variant="outline"
              className="w-full"
            >
              <Share2 className="mr-2" />
              Share Results
            </Button>
          </div>
        </Card>
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
          <Image
            src="https://placehold.co/600x400.png"
            alt="Triathlete running towards finish line"
            data-ai-hint="triathlon running"
            width={600}
            height={400}
            className="w-full h-auto object-cover transition-transform hover:scale-105 duration-300"
          />
        </Card>
      </div>
    </div>
  );
}
