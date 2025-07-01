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
import { Download, FileText, Info, Loader2 } from 'lucide-react';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import {
  generatePacePlan,
  type PacePlanOutput,
} from '@/ai/flows/generate-pace-plan';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PacePlannerProps {
  distance: DistanceKey;
  bikeTime: Time;
  runTime: Time;
}

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

const PlanTable = ({
  title,
  splits,
  paceUnit,
}: {
  title: string;
  splits: PacePlanOutput['bikePlan'] | PacePlanOutput['runPlan'];
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
  const [pacePlan, setPacePlan] = useState<PacePlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeneratePlan = async () => {
    if (timeToSeconds(bikeTime) === 0 && timeToSeconds(runTime) === 0) {
      toast({
        variant: 'destructive',
        title: 'No time entered',
        description: 'Please enter a bike or run time to generate a pace plan.',
      });
      return;
    }

    setIsLoading(true);
    setPacePlan(null);
    try {
      const plan = await generatePacePlan({ distance, bikeTime, runTime });
      setPacePlan(plan);
    } catch (error) {
      console.error('Error generating pace plan:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Plan',
        description:
          'The AI could not generate a pace plan. This can happen with very fast or slow times. Please adjust and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toCSV = (plan: PacePlanOutput) => {
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
          Generate a detailed pace card with splits and coaching tips from AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2 h-24">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>AI is generating your race plan...</p>
          </div>
        )}

        {!isLoading && !pacePlan && (
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

        {!isLoading && pacePlan && (
          <div className="space-y-6">
            <PlanTable
              title="Bike Pace Plan"
              splits={pacePlan.bikePlan}
              paceUnit="Speed"
            />
            <PlanTable
              title="Run Pace Plan"
              splits={pacePlan.runPlan}
              paceUnit="Pace"
            />
          </div>
        )}
      </CardContent>
      {pacePlan && !isLoading && (
        <CardFooter className="flex justify-between">
          <Button
            variant="ghost"
            onClick={handleGeneratePlan}
            disabled={isLoading}
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
