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
import { PaceInputGroup } from '@/components/pace-input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
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

type Pace = { m: number; s: number };

const DISTANCES = {
  full: { swim: 3800, bike: 180, run: 42.2, name: 'Full Distance' },
  half: { swim: 1900, bike: 90, run: 21.1, name: 'Half Distance' },
  olympic: { swim: 1500, bike: 40, run: 10, name: 'Olympic' },
  sprint: { swim: 750, bike: 20, run: 5, name: 'Sprint' },
};
type DistanceKey = keyof typeof DISTANCES;

export function IronTimePredictor() {
  // Time states
  const [swimTime, setSwimTime] = useState<Time>(zeroTime);
  const [t1Time, setT1Time] = useState<Time>(zeroTime);
  const [bikeTime, setBikeTime] = useState<Time>(zeroTime);
  const [t2Time, setT2Time] = useState<Time>(zeroTime);
  const [runTime, setRunTime] = useState<Time>(zeroTime);
  const [totalTime, setTotalTime] = useState<Time>(zeroTime);

  // Input mode and value states
  const [distance, setDistance] = useState<DistanceKey>('full');
  const [swimInputMode, setSwimInputMode] = useState<'time' | 'pace'>('time');
  const [bikeInputMode, setBikeInputMode] = useState<'time' | 'speed'>('time');
  const [runInputMode, setRunInputMode] = useState<'time' | 'pace'>('time');

  const [swimPace, setSwimPace] = useState<Pace>({ m: 1, s: 45 });
  const [bikeSpeed, setBikeSpeed] = useState(35);
  const [runPace, setRunPace] = useState<Pace>({ m: 5, s: 30 });

  // UI States
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

  // Effect to calculate total time
  useEffect(() => {
    const totalSeconds =
      timeToSeconds(swimTime) +
      timeToSeconds(t1Time) +
      timeToSeconds(bikeTime) +
      timeToSeconds(t2Time) +
      timeToSeconds(runTime);
    setTotalTime(secondsToTime(totalSeconds));
  }, [swimTime, t1Time, bikeTime, t2Time, runTime]);

  // Effects to calculate discipline times from pace/speed
  useEffect(() => {
    if (swimInputMode === 'pace') {
      const paceInSeconds = swimPace.m * 60 + swimPace.s;
      if (paceInSeconds === 0) {
        setSwimTime(zeroTime);
        return;
      }
      const totalSeconds = (DISTANCES[distance].swim / 100) * paceInSeconds;
      setSwimTime(secondsToTime(totalSeconds));
    }
  }, [swimPace, distance, swimInputMode]);

  useEffect(() => {
    if (bikeInputMode === 'speed') {
      if (bikeSpeed <= 0) {
        setBikeTime(zeroTime);
        return;
      }
      const totalHours = DISTANCES[distance].bike / bikeSpeed;
      const totalSeconds = totalHours * 3600;
      setBikeTime(secondsToTime(totalSeconds));
    }
  }, [bikeSpeed, distance, bikeInputMode]);

  useEffect(() => {
    if (runInputMode === 'pace') {
      const paceInSeconds = runPace.m * 60 + runPace.s;
      if (paceInSeconds === 0) {
        setRunTime(zeroTime);
        return;
      }
      const totalSeconds = DISTANCES[distance].run * paceInSeconds;
      setRunTime(secondsToTime(totalSeconds));
    }
  }, [runPace, distance, runInputMode]);


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
      `My Predicted ${DISTANCES[distance].name} Time: ${formatTime(totalTime)}\n\n` +
      `Swim: ${formatTime(swimTime)}\n` +
      `T1: ${formatTime(t1Time)}\n` +
      `Bike: ${formatTime(bikeTime)}\n` +
      `T2: ${formatTime(t2Time)}\n` +
      `Run: ${formatTime(runTime)}\n\n` +
      (insight
        ? `AI Insight: ${insight}\n\n`
        : '') +
      'Get your own prediction at IronTime Predictor!';

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
            Race Configuration
          </CardTitle>
          <CardDescription>
            Select a distance, then enter your times, paces, or speeds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-lg font-medium mb-2 block">Distance</Label>
            <RadioGroup
              value={distance}
              onValueChange={(value) => setDistance(value as DistanceKey)}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {Object.keys(DISTANCES).map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem value={key} id={key} />
                  <Label htmlFor={key} className="cursor-pointer">{DISTANCES[key as DistanceKey].name}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <Separator />
          <div className="flex flex-col space-y-6 pt-2">
            {/* Swim Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <Waves className="text-primary size-6" />
                  Swim
                </Label>
                <div className="text-right">
                  <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatTime(swimTime)}</p>
                  <p className="text-xs text-muted-foreground -mt-1">Calculated Time</p>
                </div>
              </div>
              <Tabs value={swimInputMode} onValueChange={(v) => setSwimInputMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="time">Set Time</TabsTrigger><TabsTrigger value="pace">Set Pace</TabsTrigger></TabsList>
                <TabsContent value="time" className="pt-4"><TimeInputGroup time={swimTime} setTime={setSwimTime} /></TabsContent>
                <TabsContent value="pace" className="pt-4"><PaceInputGroup unit="/100m" pace={swimPace} setPace={setSwimPace} /></TabsContent>
              </Tabs>
            </div>

            <Separator />

            {/* T1 Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <ArrowRightLeft className="text-accent size-6" />
                  Transition 1
                </Label>
                <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatTime(t1Time)}</p>
              </div>
              <TimeInputGroup time={t1Time} setTime={setT1Time} />
            </div>

            <Separator />

            {/* Bike Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <Bike className="text-primary size-6" />
                  Bike
                </Label>
                <div className="text-right">
                  <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatTime(bikeTime)}</p>
                  <p className="text-xs text-muted-foreground -mt-1">Calculated Time</p>
                </div>
              </div>
              <Tabs value={bikeInputMode} onValueChange={(v) => setBikeInputMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="time">Set Time</TabsTrigger><TabsTrigger value="speed">Set Speed</TabsTrigger></TabsList>
                <TabsContent value="time" className="pt-4"><TimeInputGroup time={bikeTime} setTime={setBikeTime} /></TabsContent>
                <TabsContent value="speed" className="pt-4">
                  <div className="space-y-2">
                      <Label className="text-sm font-medium">Speed <span className="text-sm text-muted-foreground">(km/h)</span></Label>
                      <Input type="number" value={bikeSpeed} onChange={(e) => setBikeSpeed(Number(e.target.value) || 0)} placeholder="e.g. 35" aria-label="Bike speed in km/h" min="0" className="font-mono text-center" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator />

            {/* T2 Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <ArrowRightLeft className="text-accent size-6" />
                  Transition 2
                </Label>
                <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatTime(t2Time)}</p>
              </div>
              <TimeInputGroup time={t2Time} setTime={setT2Time} />
            </div>

            <Separator />

            {/* Run Section */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <PersonStanding className="text-primary size-6" />
                  Run
                </Label>
                <div className="text-right">
                  <p className="font-mono text-3xl font-bold tracking-tight text-primary">{formatTime(runTime)}</p>
                  <p className="text-xs text-muted-foreground -mt-1">Calculated Time</p>
                </div>
              </div>
              <Tabs value={runInputMode} onValueChange={(v) => setRunInputMode(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="time">Set Time</TabsTrigger><TabsTrigger value="pace">Set Pace</TabsTrigger></TabsList>
                <TabsContent value="time" className="pt-4"><TimeInputGroup time={runTime} setTime={setRunTime} /></TabsContent>
                <TabsContent value="pace" className="pt-4"><PaceInputGroup unit="/km" pace={runPace} setPace={setRunPace} /></TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <div className="mt-auto">
          <Image
            src="https://placehold.co/800x400.png"
            alt="Triathlete crossing the finish line"
            data-ai-hint="triathlon finish"
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
