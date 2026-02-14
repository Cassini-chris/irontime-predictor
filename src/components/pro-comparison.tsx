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
  swimTime: Time;
  bikeTime: Time;
  runTime: Time;
  distance: DistanceKey;
}

const PRO_PBS = {
  blummenfelt: {
    name: 'Kristian Blummenfelt',
    description: 'The Olympic champion and a powerhouse across all distances.',
    pbs: {
      full: 7 * 3600 + 21 * 60 + 12,
    },
    splits: {
      full: { swim: '48:21', bike: '3:24:22', run: '2:30:50' }
    }
  },
  frodeno: {
    name: 'Jan Frodeno',
    description: 'Widely considered the G.O.A.T. of long-distance triathlon.',
    pbs: {
      full: 7 * 3600 + 27 * 60 + 53,
    },
    splits: {
      full: { swim: '45:58', bike: '3:55:22', run: '2:39:18' }
    }
  },
  ryf: {
    name: 'Daniela Ryf',
    description: 'The dominant force in female long-distance racing for a decade.',
    pbs: {
      full: 8 * 3600 + 8 * 60 + 21,
    },
    splits: {
      full: { swim: '49:34', bike: '4:22:56', run: '2:51:53' }
    }
  },
  sanders: {
    name: 'Lionel Sanders',
    description: 'Known for his incredible bike power and "no limits" racing style.',
    pbs: {
      full: 7 * 3600 + 43 * 60 + 28,
    },
    splits: {
      full: { swim: '53:45', bike: '4:04:38', run: '2:42:31' }
    }
  },
  'ag-avg': {
    name: 'Average Age Grouper',
    description: 'A competitive time for a typical age group athlete.',
    pbs: {
      full: 12 * 3600 + 35 * 60,
    },
    splits: {
      full: { swim: '1:15:00', bike: '6:15:00', run: '4:45:00' } // Approx
    }
  }
};

type ProKey = keyof typeof PRO_PBS;

const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

const formatTime = (time: Time) => {
  return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(2, '0')}:${String(time.s).padStart(2, '0')}`;
};

export function ProComparison({
  totalTime,
  swimTime,
  bikeTime,
  runTime,
  distance,
}: ProComparisonProps) {
  const [selectedPro, setSelectedPro] = useState<ProKey>('blummenfelt');

  const userTotalSeconds = timeToSeconds(totalTime);
  const proData = PRO_PBS[selectedPro];

  // Create safe defaults if distance doesn't exist in data
  const proSeconds = proData.pbs.full;
  const proSplits = proData.splits?.full || { swim: 'N/A', bike: 'N/A', run: 'N/A' };

  if (distance !== 'full') {
    return (
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 opacity-80">
        <CardHeader>
          <CardTitle className="text-xl">Pro-Benchmark</CardTitle>
          <CardDescription>Detailed comparisons available for Full Distance only.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const comparisonText = userTotalSeconds > proSeconds
    ? `Your time is ${((userTotalSeconds / proSeconds - 1) * 100).toFixed(0)}% slower than their record.`
    : `Your time is ${((proSeconds / userTotalSeconds - 1) * 100).toFixed(0)}% faster than their record!`;

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
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">{proData.description}</p>

        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div className="font-semibold text-muted-foreground">Discipline</div>
          <div className="font-semibold text-primary">Pro</div>
          <div className="font-semibold text-foreground">You</div>
          <div className="font-semibold text-muted-foreground">Diff</div>

          <div className="text-left font-medium">Swim</div>
          <div className="font-mono">{proSplits.swim}</div>
          <div className="font-mono">{formatTime(swimTime)}</div>
          <div className="text-xs text-muted-foreground">-</div>

          <div className="text-left font-medium">Bike</div>
          <div className="font-mono">{proSplits.bike}</div>
          <div className="font-mono">{formatTime(bikeTime)}</div>
          <div className="text-xs text-muted-foreground">-</div>

          <div className="text-left font-medium">Run</div>
          <div className="font-mono">{proSplits.run}</div>
          <div className="font-mono">{formatTime(runTime)}</div>
          <div className="text-xs text-muted-foreground">-</div>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-sm font-semibold mb-1">Total Comparison</p>
          <p className="font-medium text-lg">
            {comparisonText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
