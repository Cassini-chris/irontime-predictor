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
import { PacePlanner } from './pace-planner';

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

  const AccordionTriggerLayout = ({
    icon,
    label,
    time,
    isCalculated = false,
    colorClass = 'text-primary',
  }: {
    icon: React.ReactNode;
    label: string;
    time: Time;
    isCalculated?: boolean;
    colorClass?: string;
  }) => (
    <div className="flex justify-between items-center w-full pr-4">
      <Label className="flex items-center gap-3 text-lg font-medium font-headline">
        {icon}
        {label}
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
          <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-3">
            <Target className="h-6 w-6 text-primary" />
            Goal Setter
          </CardTitle>
          <CardDescription>
            Set your goal time to calculate discipline paces.
          </CardDescription>
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
              <p className="text-6xl md:text-7xl font-bold font-mono text-primary tracking-tighter text-center py-4">
                {formatTime(totalTime)}
              </p>
              <div className="text-center text-muted-foreground">
                <p>Swim Pace: {summary.swimPace}</p>
                <p>Bike Speed: {summary.bikeSpeed}</p>
                <p>Run Pace: {summary.runPace}</p>
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
          <PacePlanner
            distance={distance}
            bikeTime={bikeTime}
            runTime={runTime}
          />
          <ProComparison totalTime={totalTime} distance={distance} />
        </div>
      </div>
    </>
  );
}
