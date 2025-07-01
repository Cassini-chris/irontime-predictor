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
import { Download, FileText } from 'lucide-react';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';

type Split = {
  segment: string;
  targetTime: string;
  targetPace: string;
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

const formatPace = (paceSecPerKm: number) => {
  let paceMin = Math.floor(paceSecPerKm / 60);
  let paceSec = Math.round(paceSecPerKm % 60);
  if (paceSec === 60) {
    paceMin += 1;
    paceSec = 0;
  }
  return `${String(paceMin).padStart(2, '0')}:${String(
    paceSec
  ).padStart(2, '0')} min/km`;
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

/**
 * Generates pace multipliers for a negative split.
 * @param segmentCount The number of segments.
 * @param intensity The percentage difference between the first and last segment pace (e.g., 0.03 for 3%).
 * @returns An array of multipliers that result in a slower-to-faster pace progression.
 */
function getNegativeSplitPaceMultipliers(
  segmentCount: number,
  intensity: number = 0.03
): number[] {
  if (segmentCount <= 1) {
    return [1];
  }
  const multipliers: number[] = [];
  // Create a decreasing arithmetic series (from slower pace to faster pace)
  for (let i = 0; i < segmentCount; i++) {
    const progress = i / (segmentCount - 1); // 0 to 1
    multipliers.push(1 + intensity / 2 - progress * intensity);
  }

  // Normalize multipliers so their average is 1
  const sum = multipliers.reduce((a, b) => a + b, 0);
  const normalizationFactor = segmentCount / sum;
  return multipliers.map((m) => m * normalizationFactor);
}

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
            <TableHead className="text-right">{paceUnit}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((split, index) => (
            <TableRow key={`${title}-${index}`}>
              <TableCell className="font-medium">{split.segment}</TableCell>
              <TableCell>{split.targetTime}</TableCell>
              <TableCell className="text-right">{split.targetPace}</TableCell>
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

    // Bike Plan (Negative Split - Slower start, faster finish)
    if (bikeTotalSeconds > 0) {
      const bikeTotalDistance = DISTANCES[distance].bike;
      const avgSpeedKmh = bikeTotalDistance / (bikeTotalSeconds / 3600);
      const bikeSegments = getBikeSegments(distance);

      // Slower to faster pace -> Slower to faster speed
      const paceMultipliers = getNegativeSplitPaceMultipliers(
        bikeSegments.length,
        0.02
      );
      const speedMultipliers = paceMultipliers.map((m) => 1 / m);

      // Normalize speed multipliers
      const speedSum = speedMultipliers.reduce((a, b) => a + b, 0);
      const normalizedSpeedMultipliers = speedMultipliers.map(
        (m) => (m * bikeSegments.length) / speedSum
      );

      const segmentDistances = bikeSegments.map((seg) => seg.end - seg.start);
      const segmentSpeeds = normalizedSpeedMultipliers.map(
        (m) => avgSpeedKmh * m
      );
      const segmentTimes = segmentDistances.map(
        (dist, i) => (dist / segmentSpeeds[i]) * 3600
      );

      const calculatedTotalTime = segmentTimes.reduce((a, b) => a + b, 0);
      const correctionFactor = bikeTotalSeconds / calculatedTotalTime;

      const finalSegmentTimes = segmentTimes.map((t) => t * correctionFactor);

      finalSegmentTimes.forEach((time, index) => {
        const seg = bikeSegments[index];
        const segDist = segmentDistances[index];
        const segSpeed = (segDist / time) * 3600;
        newBikePlan.push({
          segment: `${seg.start.toFixed(1).replace('.0', '')}-${seg.end
            .toFixed(1)
            .replace('.0', '')} km`,
          targetTime: secondsToTimeStr(time),
          targetPace: `${segSpeed.toFixed(1)} km/h`,
        });
      });
    }

    // Run Plan (Negative Split - Slower start, faster finish)
    if (runTotalSeconds > 0) {
      const runTotalDistance = DISTANCES[distance].run;
      const avgPaceSecPerKm = runTotalSeconds / runTotalDistance;
      const runSegments = getRunSegments(distance);
      const paceMultipliers = getNegativeSplitPaceMultipliers(
        runSegments.length,
        0.03
      );

      const segmentDistances = runSegments.map((seg) => seg.end - seg.start);
      const segmentPaces = paceMultipliers.map((m) => avgPaceSecPerKm * m);
      const segmentTimes = segmentDistances.map(
        (dist, i) => dist * segmentPaces[i]
      );

      const calculatedTotalTime = segmentTimes.reduce((a, b) => a + b, 0);
      const correctionFactor = runTotalSeconds / calculatedTotalTime;

      const finalSegmentTimes = segmentTimes.map((t) => t * correctionFactor);

      finalSegmentTimes.forEach((time, index) => {
        const seg = runSegments[index];
        const segDist = segmentDistances[index];
        const segPace = time / segDist;
        newRunPlan.push({
          segment: `${seg.start.toFixed(1).replace('.0', '')}-${seg.end
            .toFixed(1)
            .replace('.0', '')} km`,
          targetTime: secondsToTimeStr(time),
          targetPace: formatPace(segPace),
        });
      });
    }

    setPacePlan({ bikePlan: newBikePlan, runPlan: newRunPlan });
  };

  const toCSV = (plan: PacePlan) => {
    const headers = ['Discipline', 'Segment', 'Target Time', 'Target Pace/Speed'];
    const rows = [headers.join(',')];

    plan.bikePlan.forEach((split) => {
      rows.push(
        [
          'Bike',
          `"${split.segment}"`,
          `"${split.targetTime}"`,
          `"${split.targetPace}"`,
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
          Generate a detailed negative-split pace card for race day.
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
          <Button variant="ghost" onClick={handleGeneratePlan}>
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
