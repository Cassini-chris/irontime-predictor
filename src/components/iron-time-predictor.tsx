'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TimeInputGroup } from '@/components/time-input-group';
import { PaceInputGroup } from '@/components/pace-input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ResultsChart } from '@/components/results-chart';
import {
  Waves,
  Bike,
  PersonStanding,
  ArrowRightLeft,
} from 'lucide-react';

export type Time = { h: number; m: number; s: number };
const zeroTime: Time = { h: 0, m: 0, s: 0 };

type Pace = { m: number; s: number };

const DISTANCES = {
  full: { swim: 3800, bike: 180, run: 42.2, name: 'Full Distance' },
  half: { swim: 1900, bike: 90, run: 21.1, name: 'Half Distance' },
  olympic: { swim: 1500, bike: 40, run: 10, name: 'Olympic' },
  sprint: { swim: 750, bike: 20, run: 5, name: 'Sprint' },
};
export type DistanceKey = keyof typeof DISTANCES;

export function IronTimePredictor() {
  // Time states
  const [swimTime, setSwimTime] = useState<Time>(zeroTime);
  const [t1Time, setT1Time] = useState<Time>({ h: 0, m: 5, s: 0 });
  const [bikeTime, setBikeTime] = useState<Time>(zeroTime);
  const [t2Time, setT2Time] = useState<Time>({ h: 0, m: 3, s: 0 });
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
          <div className="flex flex-col pt-2">
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
                <TabsContent value="pace" className="pt-4"><PaceInputGroup unit="min/100m" pace={swimPace} setPace={setSwimPace} /></TabsContent>
              </Tabs>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
               <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <ArrowRightLeft className="text-accent size-6" />
                  Transition 1
                </Label>
                <p className="font-mono text-3xl font-bold tracking-tight text-accent">{formatTime(t1Time)}</p>
              </div>
              <TimeInputGroup time={t1Time} setTime={setT1Time} />
            </div>

            <Separator className="my-6" />

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
            
            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <Label className="flex items-center gap-2 text-xl font-medium font-headline">
                  <ArrowRightLeft className="text-accent size-6" />
                  Transition 2
                </Label>
                <p className="font-mono text-3xl font-bold tracking-tight text-accent">{formatTime(t2Time)}</p>
              </div>
              <TimeInputGroup time={t2Time} setTime={setT2Time} />
            </div>

            <Separator className="my-6" />

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
                <TabsContent value="pace" className="pt-4"><PaceInputGroup unit="min/km" pace={runPace} setPace={setRunPace} /></TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
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

        <ResultsChart
          totalTime={totalTime}
          swimTime={swimTime}
          bikeTime={bikeTime}
          runTime={runTime}
          distance={distance}
        />
      </div>
    </div>
  );
}
