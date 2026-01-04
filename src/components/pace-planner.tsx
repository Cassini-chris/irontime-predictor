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
import { Download, FileText, Loader2 } from 'lucide-react';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import { generatePacePlan, type PacePlanOutput } from '@/ai/flows/generate-pace-plan';
import { useToast } from '@/hooks/use-toast';

interface PacePlannerProps {
  distance: DistanceKey;
  bikeTime: Time;
  runTime: Time;
}

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

type Split = {
    segment: string;
    targetTime: string;
    targetPace: string;
    tip: string;
};

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
            <TableHead>{paceUnit}</TableHead>
            <TableHead className="hidden sm:table-cell">Tip</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {splits.map((split, index) => (
            <TableRow key={`${title}-${index}`}>
              <TableCell className="font-medium">{split.segment}</TableCell>
              <TableCell>{split.targetPace}</TableCell>
              <TableCell className="hidden sm:table-cell">{split.tip}</TableCell>
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
  const [pacePlan, setPacePlan] = useState<PacePlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setPacePlan(null);
    try {
      const plan = await generatePacePlan({ distance, bikeTime, runTime });
      setPacePlan(plan);
    } catch (error) {
      console.error('Error generating pace plan:', error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Could not generate a pace plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toCSV = (plan: PacePlanOutput) => {
    const headers = ['Discipline', 'Segment', 'Target Pace/Speed', 'Tip'];
    const rows = [headers.join(',')];

    plan.bikePlan.forEach((split) => {
      rows.push(
        [
          'Bike',
          `"${split.segment}"`,
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
          AI Race Pace Planner
        </CardTitle>
        <CardDescription>
          Let our AI coach generate a detailed negative-split pace card for
          race day.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!pacePlan && !isLoading && (
          <div className="flex flex-col items-center justify-center text-center space-y-2 h-24">
            <p className="text-muted-foreground">
              {hasTimes
                ? 'Ready to create your personalized race strategy?'
                : 'Enter bike or run times to enable the planner.'}
            </p>
            <Button
              onClick={handleGeneratePlan}
              disabled={!hasTimes || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Generate AI Pace Plan'
              )}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center h-24 space-x-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-muted-foreground">AI is generating your plan...</p>
          </div>
        )}

        {pacePlan && !isLoading && (
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
      {pacePlan && !isLoading && (
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={handleGeneratePlan} disabled={isLoading}>
             {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Regenerate'
              )}
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download CSV
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
