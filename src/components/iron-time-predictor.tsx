'use client';

import { useState, useEffect, useRef } from 'react';
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ResultsChart } from '@/components/results-chart';
import { DistanceIcon } from './distance-icon';
import {
  Waves,
  Bike,
  PersonStanding,
  ArrowRightLeft,
  SlidersHorizontal,
  Target,
} from 'lucide-react';
import { GoalSetter } from './goal-setter';
import { ProComparison } from './pro-comparison';
import { NutritionCalculator } from './nutrition-calculator';
import { RaceDayChecklist } from './race-day-checklist';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Time = { h: number; m: number; s: number };
const zeroTime: Time = { h: 0, m: 0, s: 0 };

export type Pace = { m: number; s: number };

const DISTANCES = {
  full: { swim: 3800, bike: 180, run: 42.2, name: 'Full Distance' },
  half: { swim: 1900, bike: 90, run: 21.1, name: 'Half Distance' },
  olympic: { swim: 1500, bike: 40, run: 10, name: 'Olympic' },
  sprint: { swim: 750, bike: 20, run: 5, name: 'Sprint' },
};
export type DistanceKey = keyof typeof DISTANCES;

interface IronTimePredictorProps {
  swimTime: Time;
  setSwimTime: (time: Time) => void;
  t1Time: Time;
  setT1Time: (time: Time) => void;
  bikeTime: Time;
  setBikeTime: (time: Time) => void;
  t2Time: Time;
  setT2Time: (time: Time) => void;
  runTime: Time;
  setRunTime: (time: Time) => void;
  distance: DistanceKey;
  setDistance: (distance: DistanceKey) => void;
}

export function IronTimePredictor({
  swimTime,
  setSwimTime,
  t1Time,
  setT1Time,
  bikeTime,
  setBikeTime,
  t2Time,
  setT2Time,
  runTime,
  setRunTime,
  distance,
  setDistance,
}: IronTimePredictorProps) {
  const [totalTime, setTotalTime] = useState<Time>(zeroTime);
  const [mainMode, setMainMode] = useState<'manual' | 'goal'>('goal');

  // Input mode and value states
  const [swimInputMode, setSwimInputMode] = useState<'time' | 'pace'>('time');
  const [bikeInputMode, setBikeInputMode] = useState<'time' | 'speed'>('time');
  const [runInputMode, setRunInputMode] = useState<'time' | 'pace'>('time');

  const [swimPace, setSwimPace] = useState<Pace>({ m: 1, s: 45 });
  const [bikeSpeed, setBikeSpeed] = useState(35);
  const [runPace, setRunPace] = useState<Pace>({ m: 5, s: 30 });

  const totalTimeCardRef = useRef<HTMLDivElement>(null);
  const [isTotalTimeVisible, setIsTotalTimeVisible] = useState(true);

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
  }, [swimPace, distance, swimInputMode, setSwimTime]);

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
  }, [bikeSpeed, distance, bikeInputMode, setBikeTime]);

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
  }, [runPace, distance, runInputMode, setRunTime]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTotalTimeVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = totalTimeCardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const formatTime = (time: Time) => {
    return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(
      2,
      '0'
    )}:${String(time.s).padStart(2, '0')}`;
  };

  const getSummary = () => {
    const swimSeconds = timeToSeconds(swimTime);
    const swimPacePer100m = swimSeconds > 0 ? (swimSeconds / DISTANCES[distance].swim) * 100 : 0;
    const swimPaceMinutes = Math.floor(swimPacePer100m / 60);
    const swimPaceSeconds = Math.floor(swimPacePer100m % 60);

    const bikeHours = timeToSeconds(bikeTime) / 3600;
    const bikeKmh = bikeHours > 0 ? DISTANCES[distance].bike / bikeHours : 0;

    const runSeconds = timeToSeconds(runTime);
    const runPacePerKm = runSeconds > 0 ? runSeconds / DISTANCES[distance].run : 0;
    const runPaceMinutes = Math.floor(runPacePerKm / 60);
    const runPaceSeconds = Math.floor(runPacePerKm % 60);

    return {
      swimPace: `${swimPaceMinutes}:${String(swimPaceSeconds).padStart(2, '0')} min/100m`,
      bikeSpeed: `${bikeKmh.toFixed(2)} km/h`,
      runPace: `${runPaceMinutes}:${String(runPaceSeconds).padStart(2, '0')} min/km`,
    };
  };

  const summary = getSummary();

  const resetAll = () => {
    if (confirm('Are you sure you want to reset all times?')) {
      setSwimTime(zeroTime);
      setBikeTime(zeroTime);
      setRunTime(zeroTime);
      // Default transition times
      setT1Time({ h: 0, m: 5, s: 0 });
      setT2Time({ h: 0, m: 3, s: 0 });
    }
  };

  const AccordionTriggerLayout = ({
    icon,
    label,
    time,
    isCalculated = false,
    colorClass = 'text-primary',
    stat,
  }: {
    icon: React.ReactNode;
    label: string;
    time: Time;
    isCalculated?: boolean;
    colorClass?: string;
    stat?: string;
  }) => (
    <div className="flex justify-between items-center w-full pr-4">
      <Label className="flex items-center gap-3 text-lg font-medium font-headline">
        {icon}
        <div>
          <p>{label}</p>
          {stat && <p className="text-xs text-muted-foreground font-normal">{stat}</p>}
        </div>
      </Label>
      <div className="text-right">
        <p
          className={`font-mono text-xl font-bold tracking-tight ${colorClass}`}
        >
          {formatTime(time)}
        </p>
        {isCalculated && (
          <p className="text-xs text-muted-foreground -mt-1">
            Calculated Time
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {!isTotalTimeVisible && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary/95 backdrop-blur-sm text-primary-foreground p-3 text-center shadow-lg z-50 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 lg:hidden">
          <span className="font-medium text-sm">Your Time: </span>
          <span className="font-bold font-mono tracking-tighter text-lg">
            {formatTime(totalTime)}
          </span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 w-full">
        <Card className="lg:col-span-3 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-3">
                  <Target className="h-6 w-6 text-primary" />
                  Goal Setter
                </CardTitle>
                <CardDescription>
                  Set your goal time to calculate discipline paces.
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={resetAll} title="Reset All Times">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <GoalSetter
              distance={distance}
              setSwimTime={setSwimTime}
              setBikeTime={setBikeTime}
              setRunTime={setRunTime}
              setT1Time={setT1Time}
              setT2Time={setT2Time}
              setMainMode={setMainMode}
            />
            <Accordion
              type="single"
              collapsible
              defaultValue="swim"
              className="w-full pt-2 space-y-2"
            >
              {/* Swim Section */}
              <AccordionItem value="swim">
                <AccordionTrigger>
                  <AccordionTriggerLayout
                    icon={<Waves className="text-primary size-6" />}
                    label="Swim"
                    time={swimTime}
                    isCalculated={swimInputMode === 'pace'}
                    stat={summary.swimPace}
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Tabs
                    value={swimInputMode}
                    onValueChange={(v) => setSwimInputMode(v as any)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="time">Set Time</TabsTrigger>
                      <TabsTrigger value="pace">Set Pace</TabsTrigger>
                    </TabsList>
                    <TabsContent value="time" className="pt-4">
                      <TimeInputGroup time={swimTime} setTime={setSwimTime} />
                    </TabsContent>
                    <TabsContent value="pace" className="pt-4">
                      <PaceInputGroup
                        unit="min/100m"
                        pace={swimPace}
                        setPace={setSwimPace}
                      />
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>

              {/* Transition 1 Section */}
              <AccordionItem value="t1">
                <AccordionTrigger>
                  <AccordionTriggerLayout
                    icon={
                      <ArrowRightLeft className="text-accent size-6" />
                    }
                    label="Transition 1"
                    time={t1Time}
                    colorClass="text-accent"
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <TimeInputGroup time={t1Time} setTime={setT1Time} />
                </AccordionContent>
              </AccordionItem>

              {/* Bike Section */}
              <AccordionItem value="bike">
                <AccordionTrigger>
                  <AccordionTriggerLayout
                    icon={<Bike className="text-primary size-6" />}
                    label="Bike"
                    time={bikeTime}
                    isCalculated={bikeInputMode === 'speed'}
                    stat={summary.bikeSpeed}
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Tabs
                    value={bikeInputMode}
                    onValueChange={(v) => setBikeInputMode(v as any)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="time">Set Time</TabsTrigger>
                      <TabsTrigger value="speed">Set Speed</TabsTrigger>
                    </TabsList>
                    <TabsContent value="time" className="pt-4">
                      <TimeInputGroup time={bikeTime} setTime={setBikeTime} />
                    </TabsContent>
                    <TabsContent value="speed" className="pt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Speed{' '}
                          <span className="text-sm text-muted-foreground">
                            (km/h)
                          </span>
                        </Label>
                        <Input
                          type="number"
                          value={bikeSpeed}
                          onChange={(e) =>
                            setBikeSpeed(Number(e.target.value) || 0)
                          }
                          placeholder="e.g. 35"
                          aria-label="Bike speed in km/h"
                          min="0"
                          className="font-mono text-center"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>

              {/* Transition 2 Section */}
              <AccordionItem value="t2">
                <AccordionTrigger>
                  <AccordionTriggerLayout
                    icon={
                      <ArrowRightLeft className="text-accent size-6" />
                    }
                    label="Transition 2"
                    time={t2Time}
                    colorClass="text-accent"
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <TimeInputGroup time={t2Time} setTime={setT2Time} />
                </AccordionContent>
              </AccordionItem>

              {/* Run Section */}
              <AccordionItem value="run">
                <AccordionTrigger>
                  <AccordionTriggerLayout
                    icon={
                      <PersonStanding className="text-primary size-6" />
                    }
                    label="Run"
                    time={runTime}
                    isCalculated={runInputMode === 'pace'}
                    stat={summary.runPace}
                  />
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <Tabs
                    value={runInputMode}
                    onValueChange={(v) => setRunInputMode(v as any)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="time">Set Time</TabsTrigger>
                      <TabsTrigger value="pace">Set Pace</TabsTrigger>
                    </TabsList>
                    <TabsContent value="time" className="pt-4">
                      <TimeInputGroup time={runTime} setTime={setRunTime} />
                    </TabsContent>
                    <TabsContent value="pace" className="pt-4">
                      <PaceInputGroup
                        unit="min/km"
                        pace={runPace}
                        setPace={setRunPace}
                      />
                    </TabsContent>
                  </Tabs>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-8">
          <Card
            ref={totalTimeCardRef}
            className="shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-headline tracking-tight">
                Your Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 rounded-xl p-6 mb-6 text-center border-2 border-primary/20">
                <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1 font-semibold">Total Time</p>
                <p className="text-6xl md:text-7xl font-black font-mono text-primary tracking-tighter">
                  {formatTime(totalTime)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <Waves className="size-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Swim Pace</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-lg">{summary.swimPace}</span>
                </div>

                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <Bike className="size-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Bike Speed</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-lg">{summary.bikeSpeed}</span>
                </div>

                <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center gap-2">
                    <PersonStanding className="size-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Run Pace</span>
                  </div>
                  <span className="font-mono font-bold text-foreground text-lg">{summary.runPace}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ResultsChart
            totalTime={totalTime}
            swimTime={swimTime}
            bikeTime={bikeTime}
            runTime={runTime}
            distance={distance}
          />
          <NutritionCalculator bikeTime={bikeTime} runTime={runTime} />
          <ProComparison
            totalTime={totalTime}
            swimTime={swimTime}
            bikeTime={bikeTime}
            runTime={runTime}
            distance={distance}
          />
          <RaceDayChecklist />
        </div>
      </div>
    </>
  );
}
