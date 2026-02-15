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

const parseSplitToSeconds = (split: string) => {
  const parts = split.split(':').map(Number);
  if (parts.length === 2) {
    // mm:ss
    return parts[0] * 60 + parts[1];
  }
  if (parts.length === 3) {
    // hh:mm:ss
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
};

const formatSecondsToTime = (totalSeconds: number) => {
  const absSeconds = Math.abs(totalSeconds);
  const h = Math.floor(absSeconds / 3600);
  const m = Math.floor((absSeconds % 3600) / 60);
  const s = absSeconds % 60;

  const sign = totalSeconds >= 0 ? '+' : '-';

  if (h > 0) {
    return `${sign}${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${sign}${m}:${String(s).padStart(2, '0')}`;
};

const formatTime = (time: Time) => {
  return `${String(time.h).padStart(2, '0')}:${String(time.m).padStart(2, '0')}:${String(time.s).padStart(2, '0')}`;
};

interface ComparisonBarProps {
  label: string;
  proSeconds: number;
  userSeconds: number;
  proTimeStr: string;
  userTimeStr: string;
  diffStr: string;
}

function ComparisonBar({ label, proSeconds, userSeconds, proTimeStr, userTimeStr, diffStr }: ComparisonBarProps) {
  const maxSeconds = Math.max(proSeconds, userSeconds);
  const proWidth = (proSeconds / maxSeconds) * 100;
  const userWidth = (userSeconds / maxSeconds) * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className={userSeconds > proSeconds ? "text-destructive" : "text-green-500"}>
          {diffStr}
        </span>
      </div>
      <div className="space-y-1">
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary/40 transition-all duration-500 ease-out"
            style={{ width: `${proWidth}%` }}
          />
          <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-primary-foreground drop-shadow-sm pointer-events-none">
            Pro: {proTimeStr}
          </div>
        </div>
        <div className="relative h-4 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${userWidth}%` }}
          />
          <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-primary-foreground drop-shadow-sm pointer-events-none">
            You: {userTimeStr}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProComparison({
  totalTime,
  swimTime,
  bikeTime,
  runTime,
  distance,
}: ProComparisonProps) {
  const [selectedPro, setSelectedPro] = useState<ProKey>('blummenfelt');

  const userTotalSeconds = timeToSeconds(totalTime);
  const userSwimSeconds = timeToSeconds(swimTime);
  const userBikeSeconds = timeToSeconds(bikeTime);
  const userRunSeconds = timeToSeconds(runTime);

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

  const swimProSeconds = parseSplitToSeconds(proSplits.swim);
  const bikeProSeconds = parseSplitToSeconds(proSplits.bike);
  const runProSeconds = parseSplitToSeconds(proSplits.run);

  const swimDiff = userSwimSeconds - swimProSeconds;
  const bikeDiff = userBikeSeconds - bikeProSeconds;
  const runDiff = userRunSeconds - runProSeconds;

  const comparisonText = userTotalSeconds > proSeconds
    ? `Your time is ${((userTotalSeconds / proSeconds - 1) * 100).toFixed(0)}% slower than their record.`
    : `Your time is ${((proSeconds / userTotalSeconds - 1) * 100).toFixed(0)}% faster than their record!`;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
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
            <SelectTrigger className="w-full sm:w-[200px]">
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
      <CardContent className="space-y-8">
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          "{proData.description}"
        </p>

        <div className="space-y-6">
          <ComparisonBar
            label="Swim"
            proSeconds={swimProSeconds}
            userSeconds={userSwimSeconds}
            proTimeStr={proSplits.swim}
            userTimeStr={formatTime(swimTime)}
            diffStr={formatSecondsToTime(swimDiff)}
          />
          <ComparisonBar
            label="Bike"
            proSeconds={bikeProSeconds}
            userSeconds={userBikeSeconds}
            proTimeStr={proSplits.bike}
            userTimeStr={formatTime(bikeTime)}
            diffStr={formatSecondsToTime(bikeDiff)}
          />
          <ComparisonBar
            label="Run"
            proSeconds={runProSeconds}
            userSeconds={userRunSeconds}
            proTimeStr={proSplits.run}
            userTimeStr={formatTime(runTime)}
            diffStr={formatSecondsToTime(runDiff)}
          />
        </div>

        <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl text-center shadow-inner">
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Total Comparison</p>
          <p className="font-headline text-xl text-foreground">
            {comparisonText}
          </p>
          <div className="mt-4 flex justify-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Pro: {formatSecondsToTime(proSeconds).substring(1)}</span>
            <span className="text-muted-foreground text-[10px] flex items-center">|</span>
            <span className="text-primary font-bold">You: {formatTime(totalTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
