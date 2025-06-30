'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import type { Time, DistanceKey } from '@/components/iron-time-predictor';

interface ResultsChartProps {
  totalTime: Time;
  distance: DistanceKey;
}

const timeToHours = (time: Time) => time.h + time.m / 60 + time.s / 3600;

// Simplified finish time distribution data for different distances
const distributionData = {
  full: {
    buckets: [
      { name: '<9h', finishers: 2, upper_bound: 9 },
      { name: '9-10h', finishers: 8, upper_bound: 10 },
      { name: '10-11h', finishers: 15, upper_bound: 11 },
      { name: '11-12h', finishers: 25, upper_bound: 12 },
      { name: '12-13h', finishers: 30, upper_bound: 13 },
      { name: '13-14h', finishers: 20, upper_bound: 14 },
      { name: '14-15h', finishers: 12, upper_bound: 15 },
      { name: '15-16h', finishers: 6, upper_bound: 16 },
      { name: '>16h', finishers: 2, upper_bound: Infinity },
    ],
    unit: 'Hours',
  },
  half: {
    buckets: [
      { name: '<4.5h', finishers: 5, upper_bound: 4.5 },
      { name: '4.5-5h', finishers: 15, upper_bound: 5 },
      { name: '5-5.5h', finishers: 25, upper_bound: 5.5 },
      { name: '5.5-6h', finishers: 30, upper_bound: 6 },
      { name: '6-6.5h', finishers: 20, upper_bound: 6.5 },
      { name: '6.5-7h', finishers: 10, upper_bound: 7 },
      { name: '>7h', finishers: 5, upper_bound: Infinity },
    ],
    unit: 'Hours',
  },
  olympic: {
    buckets: [
      { name: '<2:15', finishers: 10, upper_bound: 2.25 },
      { name: '2:15-2:30', finishers: 25, upper_bound: 2.5 },
      { name: '2:30-2:45', finishers: 35, upper_bound: 2.75 },
      { name: '2:45-3:00', finishers: 20, upper_bound: 3 },
      { name: '3:00-3:15', finishers: 10, upper_bound: 3.25 },
      { name: '>3:15', finishers: 5, upper_bound: Infinity },
    ],
    unit: 'H:MM',
  },
  sprint: {
    buckets: [
      { name: '<1:10', finishers: 15, upper_bound: 1.16 },
      { name: '1:10-1:20', finishers: 30, upper_bound: 1.33 },
      { name: '1:20-1:30', finishers: 35, upper_bound: 1.5 },
      { name: '1:30-1:40', finishers: 15, upper_bound: 1.66 },
      { name: '>1:40', finishers: 5, upper_bound: Infinity },
    ],
    unit: 'H:MM',
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg shadow-lg">
        <p className="label font-bold">{`Time Range: ${label}`}</p>
        <p className="intro text-muted-foreground">{`Relative Finishers: ~${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


export function ResultsChart({ totalTime, distance }: ResultsChartProps) {
  const data = distributionData[distance];
  const totalHours = timeToHours(totalTime);

  const activeIndex = useMemo(() => {
    if (totalHours === 0) return -1;
    const foundIndex = data.buckets.findIndex(bucket => totalHours < bucket.upper_bound);
    return foundIndex === -1 ? data.buckets.length - 1 : foundIndex;
  }, [totalHours, data]);


  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight">
          Finish Time Distribution
        </CardTitle>
        <CardDescription>
          See where your predicted time stacks up.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pl-0 pr-4">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.buckets} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={{stroke: 'hsl(var(--border))'}}/>
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={false} axisLine={false} label={{ value: 'Finishers (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--foreground))', style: {textAnchor: 'middle'} }}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted) / 0.5)' }} />
            <Bar dataKey="finishers" radius={[4, 4, 0, 0]}>
              {data.buckets.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === activeIndex ? 'hsl(var(--primary))' : 'hsl(var(--accent) / 0.6)'}
                  className="transition-colors duration-300"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
