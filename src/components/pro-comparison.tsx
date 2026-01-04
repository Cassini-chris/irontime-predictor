'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import { Crown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProComparisonProps {
  totalTime: Time;
  distance: DistanceKey;
}

const PRO_PBS = {
  blummenfelt: {
    name: 'Kristian Blummenfelt',
    description: 'The reigning Olympic champion and a powerhouse across all distances.',
    pbs: {
      full: 7 * 3600 + 21 * 60 + 12, // Sub7 - unofficial
      half: 3 * 3600 + 29 * 60 + 4,
      olympic: 1 * 3600 + 45 * 60 + 4,
      sprint: 50 * 60 + 53, // Not his focus, but an estimate
    },
  },
  frodeno: {
    name: 'Jan Frodeno',
    description: 'Widely considered the G.O.A.T. of long-distance triathlon.',
    pbs: {
      full: 7 * 3600 + 27 * 60 + 43, // Tri Battle - unofficial
      half: 3 * 3600 + 33 * 60 + 21,
      olympic: 1 * 3600 + 45 * 60 + 31,
      sprint: 52 * 60 + 10,
    },
  },
  ryf: {
    name: 'Daniela Ryf',
    description: 'The dominant force in female long-distance racing for a decade.',
    pbs: {
      full: 8 * 3600 + 8 * 60 + 29, // Roth 2023
      half: 3 * 3600 + 51 * 60 + 56,
      olympic: 1 * 3600 + 55 * 60 + 42,
      sprint: 58 * 60 + 54,
    },
  },
  sanders: {
    name: 'Lionel Sanders',
    description: 'Known for his incredible bike power and "no limits" racing style.',
    pbs: {
      full: 7 * 3600 + 43 * 60 + 30, // IM Arizona 2016
      half: 3 * 3600 + 41 * 60 + 11,
      olympic: 1 * 3600 + 48 * 60 + 0, // Estimate
      sprint: 55 * 60 + 0, // Estimate
    },
  },
  'ag-avg': {
    name: 'Average Age Grouper',
    description: 'A competitive time for a typical age group athlete at a championship event.',
    pbs: {
      full: 12 * 3600 + 35 * 60,
      half: 5 * 3600 + 30 * 60,
      olympic: 2 * 3600 + 45 * 60,
      sprint: 1 * 3600 + 25 * 60,
    }
  }
};

type ProKey = keyof typeof PRO_PBS;

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

const secondsToFormattedTime = (totalSeconds: number) => {
  return new Date(totalSeconds * 1000).toISOString().substr(11, 8);
};

export function ProComparison({
  totalTime,
  distance,
}: ProComparisonProps) {
  const [selectedPro, setSelectedPro] = useState<ProKey>('blummenfelt');

  const userTotalSeconds = timeToSeconds(totalTime);
  const proData = PRO_PBS[selectedPro];
  const proSeconds = proData.pbs[distance];

  const percentage =
    userTotalSeconds > 0 ? (proSeconds / userTotalSeconds) * 100 : 0;
  
  // To avoid showing 1500% for an average athlete compared to a pro
  const displayPercentage = userTotalSeconds > proSeconds ? (proSeconds / userTotalSeconds) * 100 : (userTotalSeconds / proSeconds) * 100;
  
  const comparisonText = userTotalSeconds > proSeconds 
    ? `Your time is ${((userTotalSeconds / proSeconds - 1) * 100).toFixed(0)}% slower than their record.`
    : `Your time is ${((proSeconds / userTotalSeconds - 1) * 100).toFixed(0)}% faster than their record!`;


  const proTime = secondsToFormattedTime(proSeconds);

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
              <Crown className="text-primary" />
              Pro-Benchmark
            </CardTitle>
            <CardDescription>
              How do you stack up against the legends?
            </CardDescription>
          </div>
          <Select value={selectedPro} onValueChange={(v) => setSelectedPro(v as ProKey)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a pro" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(PRO_PBS).map((key) => (
                <SelectItem key={key} value={key}>
                  {PRO_PBS[key as ProKey].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{proData.description} Their record for this distance is <span className="font-bold">{proTime}</span>.</p>
        {userTotalSeconds > 0 ? (
          <>
            <Progress value={displayPercentage} className="h-4" />
            <p className="text-center font-medium text-lg">
                {comparisonText}
            </p>
          </>
        ) : (
          <p className="text-center text-muted-foreground">
            Enter your times to see the comparison.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
