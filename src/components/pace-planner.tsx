'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, FileText, Info } from 'lucide-react';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Split = {
  segment: string;
  targetTime: string;
  targetPace: string;
  tip: string;
};

type PacePlan = {
  bikePlan: Split[];
  runPlan: Split[];
};

interface PacePlannerProps {
  distance: DistanceKey;
  bikeTime: Time;
  runTime: Time;
}

const DISTANCES = {
  full: { bike: 180, run: 42.2 },
  half: { bike: 90, run: 21.1 },
  olympic: { bike: 40, run: 10 },
  sprint: { bike: 20, run: 5 },
};

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

const secondsToTimeStr = (totalSeconds: number) => {
  const roundedTotalSeconds = Math.round(totalSeconds);
  const h = Math.floor(roundedTotalSeconds / 3600);
  const m = Math.floor((roundedTotalSeconds % 3600) / 60);
  const s = roundedTotalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(
    2,
    '0'
  )}:${String(s).padStart(2, '0')}`;
};

const getBikeSegments = (distanceKey: DistanceKey) => {
  switch (distanceKey) {
    case 'full':
      return Array.from({ length: 6 }, (_, i) => ({
        start: i * 30,
        end: (i + 1) * 30,
      }));
    case 'half':
      return Array.from({ length: 4 }, (_, i) => ({
        start: i * 22.5,
        end: (i + 1) * 22.5,
      }));
    case 'olympic':
      return Array.from({ length: 4 }, (_, i) => ({
        start: i * 10,
        end: (i + 1) * 10,
      }));
    case 'sprint':
      return Array.from({ length: 4 }, (_, i) => ({
        start: i * 5,
        end: (i + 1) * 5,
      }));
  }
};

const getRunSegments = (distanceKey: DistanceKey) => {
  switch (distanceKey) {
    case 'full':
      const full_segments = Array.from({ length: 8 }, (_, i) => ({
        start: i * 5,
        end: (i + 1) * 5,
      }));
      full_segments.push({ start: 40, end: 42.2 });
      return full_segments;
    case 'half':
      const half_segments = Array.from({ length: 4 }, (_, i) => ({
        start: i * 5,
        end: (i + 1) * 5,
      }));
      half_segments.push({ start: 20, end: 21.1 });
      return half_segments;
    case 'olympic':
      return Array.from({ length: 4 }, (_, i) => ({
        start: i * 2.5,
        end: (i + 1) * 2.5,
      }));
    case 'sprint':
      return Array.from({ length: 5 }, (_, i) => ({
        start: i * 1,
        end: (i + 1) * 1,
      }));
  }
};

const bikeTips = [
  "Settle in and find your rhythm. Don't go out too hard.",
  'Focus on consistent fueling and hydration. Stick to your plan.',
  "Maintain a steady cadence. Spin up hills, don't grind.",
  'Check your posture. Relax your shoulders and upper body.',
  'Stay mentally focused. Break the ride into manageable chunks.',
  'Prepare for the transition to the run. Spin your legs a bit faster in the last few km.',
];

const runTips = [
  'Ease into the run off the bike. Find your running legs.',
  'Focus on good form: run tall, with a slight forward lean.',
  'Control your breathing. A steady rhythm is key.',
  'Hydrate at every aid station, even if you don\'t feel thirsty.',
  'Break the run down mentally. Focus on the next kilometer or aid station.',
  'Use your mental strength. This is where the race is won or lost.',
  'Listen to your body, but remember you are stronger than you think.',
  'Empty the tank in the final stretch. Finish strong!',
];

const PlanTable = ({
  title,
  splits,
  paceUnit,
}: {
  title: string;
  splits: Split[];
  paceUnit: string;
}) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Segment</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>{paceUnit}</TableHead>
            <TableHead className="text-right">Tip</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((split, index) => (
            <TableRow key={`${title}-${index}`}>
              <TableCell className="font-medium">{split.segment}</TableCell>
              <TableCell>{split.targetTime}</TableCell>
              <TableCell>{split.targetPace}</TableCell>
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{split.tip}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export function PacePlanner({
  distance,
  bikeTime,
  runTime,
}: PacePlannerProps) {
  const [pacePlan, setPacePlan] = useState<PacePlan | null>(null);

  const handleGeneratePlan = () => {
    const bikeTotalSeconds = timeToSeconds(bikeTime);
    const runTotalSeconds = timeToSeconds(runTime);
    const newBikePlan: Split[] = [];
    const newRunPlan: Split[] = [];

    if (bikeTotalSeconds > 0) {
      const bikeTotalDistance = DISTANCES[distance].bike;
      const avgSpeedKmh = bikeTotalDistance / (bikeTotalSeconds / 3600);
      const bikeSegments = getBikeSegments(distance);

      const segmentTimes = bikeSegments.map(
        (seg) =>
          ((seg.end - seg.start) / bikeTotalDistance) * bikeTotalSeconds
      );
      const roundedSeconds = segmentTimes.map((t) => Math.round(t));
      const sumRounded = roundedSeconds.reduce((a, b) => a + b, 0);
      const diff = bikeTotalSeconds - sumRounded;
      if (roundedSeconds.length > 0)
        roundedSeconds[roundedSeconds.length - 1] += diff;

      bikeSegments.forEach((seg, index) => {
        newBikePlan.push({
          segment: `${seg.start}-${seg.end} km`,
          targetTime: secondsToTimeStr(roundedSeconds[index]),
          targetPace: `${avgSpeedKmh.toFixed(1)} km/h`,
          tip: bikeTips[index % bikeTips.length],
        });
      });
    }

    if (runTotalSeconds > 0) {
      const runTotalDistance = DISTANCES[distance].run;
      const avgPaceSecPerKm = runTotalSeconds / runTotalDistance;
      const runSegments = getRunSegments(distance);

      const segmentTimes = runSegments.map(
        (seg) => (seg.end - seg.start) * avgPaceSecPerKm
      );
      const roundedSeconds = segmentTimes.map((t) => Math.round(t));
      const sumRounded = roundedSeconds.reduce((a, b) => a + b, 0);
      const diff = runTotalSeconds - sumRounded;
      if (roundedSeconds.length > 0)
        roundedSeconds[roundedSeconds.length - 1] += diff;

      let paceMin = Math.floor(avgPaceSecPerKm / 60);
      let paceSec = Math.round(avgPaceSecPerKm % 60);
      if (paceSec === 60) {
        paceMin += 1;
        paceSec = 0;
      }
      const formattedPace = `${String(paceMin).padStart(
        2,
        '0'
      )}:${String(paceSec).padStart(2, '0')} min/km`;

      runSegments.forEach((seg, index) => {
        newRunPlan.push({
          segment: `${seg.start.toFixed(1).replace('.0', '')}-${seg.end
            .toFixed(1)
            .replace('.0', '')} km`,
          targetTime: secondsToTimeStr(roundedSeconds[index]),
          targetPace: formattedPace,
          tip: runTips[index % runTips.length],
        });
      });
    }

    setPacePlan({ bikePlan: newBikePlan, runPlan: newRunPlan });
  };

  const toCSV = (plan: PacePlan) => {
    const headers = [
      'Discipline',
      'Segment',
      'Target Time',
      'Target Pace/Speed',
      'Tip',
    ];
    const rows = [headers.join(',')];

    plan.bikePlan.forEach((split) => {
      rows.push(
        [
          'Bike',
          `"${split.segment}"`,
          `"${split.targetTime}"`,
          `"${split.targetPace}"`,
          `"${split.tip.replace(/"/g, '""')}"`,
        ].join(',')
      );
    });

    plan.runPlan.forEach((split) => {
      rows.push(
        [
          'Run',
          `"${split.segment}"`,
          `"${split.targetTime}"`,
          `"${split.targetPace}"`,
          `"${split.tip.replace(/"/g, '""')}"`,
        ].join(',')
      );
    });

    return rows.join('\n');
  };

  const handleDownload = () => {
    if (!pacePlan) return;

    const csvContent = toCSV(pacePlan);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pace-plan-${distance}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasTimes = timeToSeconds(bikeTime) > 0 || timeToSeconds(runTime) > 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
          <FileText className="text-primary" />
          Race Pace Planner
        </CardTitle>
        <CardDescription>
          Generate a detailed pace card with splits and coaching tips.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!pacePlan && (
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-24">
            <p className="text-muted-foreground">
              {hasTimes
                ? 'Ready to create your personalized race strategy?'
                : 'Enter bike or run times to enable the planner.'}
            </p>
            <Button
              onClick={handleGeneratePlan}
              disabled={!hasTimes}
              className="w-full"
            >
              Generate Pace Plan
            </Button>
          </div>
        )}

        {pacePlan && (
          <div className="space-y-6">
            {pacePlan.bikePlan.length > 0 && (
                <PlanTable
                title="Bike Pace Plan"
                splits={pacePlan.bikePlan}
                paceUnit="Speed"
                />
            )}
            {pacePlan.runPlan.length > 0 && (
                <PlanTable
                title="Run Pace Plan"
                splits={pacePlan.runPlan}
                paceUnit="Pace"
                />
            )}
          </div>
        )}
      </CardContent>
      {pacePlan && (
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleGeneratePlan}
          >
            Regenerate
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
