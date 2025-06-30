'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useMemo } from 'react';
import type { DistanceKey, Time } from '@/components/iron-time-predictor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ResultsChartProps {
  totalTime: Time;
  swimTime: Time;
  bikeTime: Time;
  runTime: Time;
  distance: DistanceKey;
}

const timeToHours = (time: Time) => time.h + time.m / 60 + time.s / 3600;
const timeToMinutes = (time: Time) => time.h * 60 + time.m + time.s / 60;

const totalTimeDistributionData = {
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

const disciplineDistributionData = {
  full: {
    swim: {
      buckets: [
        { name: '<60', finishers: 10, upper_bound: 60 },
        { name: '60-70', finishers: 25, upper_bound: 70 },
        { name: '70-80', finishers: 35, upper_bound: 80 },
        { name: '80-90', finishers: 20, upper_bound: 90 },
        { name: '>90', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<5h', finishers: 5, upper_bound: 5 },
        { name: '5-5.5h', finishers: 15, upper_bound: 5.5 },
        { name: '5.5-6h', finishers: 30, upper_bound: 6 },
        { name: '6-6.5h', finishers: 25, upper_bound: 6.5 },
        { name: '6.5-7h', finishers: 15, upper_bound: 7 },
        { name: '>7h', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
    run: {
      buckets: [
        { name: '<3.5h', finishers: 10, upper_bound: 3.5 },
        { name: '3.5-4h', finishers: 20, upper_bound: 4 },
        { name: '4-4.5h', finishers: 35, upper_bound: 4.5 },
        { name: '4.5-5h', finishers: 25, upper_bound: 5 },
        { name: '>5h', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
  },
  half: {
    swim: {
      buckets: [
        { name: '<30', finishers: 15, upper_bound: 30 },
        { name: '30-35', finishers: 30, upper_bound: 35 },
        { name: '35-40', finishers: 35, upper_bound: 40 },
        { name: '40-45', finishers: 15, upper_bound: 45 },
        { name: '>45', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<2.5h', finishers: 10, upper_bound: 2.5 },
        { name: '2.5-3h', finishers: 30, upper_bound: 3 },
        { name: '3-3.5h', finishers: 40, upper_bound: 3.5 },
        { name: '3.5-4h', finishers: 15, upper_bound: 4 },
        { name: '>4h', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
    run: {
      buckets: [
        { name: '<1.75h', finishers: 10, upper_bound: 1.75 },
        { name: '1.75-2h', finishers: 30, upper_bound: 2 },
        { name: '2-2.25h', finishers: 40, upper_bound: 2.25 },
        { name: '2.25-2.5h', finishers: 15, upper_bound: 2.5 },
        { name: '>2.5h', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
  },
  olympic: {
    swim: {
      buckets: [
        { name: '<25', finishers: 15, upper_bound: 25 },
        { name: '25-30', finishers: 35, upper_bound: 30 },
        { name: '30-35', finishers: 30, upper_bound: 35 },
        { name: '35-40', finishers: 15, upper_bound: 40 },
        { name: '>40', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<65', finishers: 10, upper_bound: 65 },
        { name: '65-75', finishers: 35, upper_bound: 75 },
        { name: '75-85', finishers: 35, upper_bound: 85 },
        { name: '85-95', finishers: 15, upper_bound: 95 },
        { name: '>95', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    run: {
      buckets: [
        { name: '<45', finishers: 10, upper_bound: 45 },
        { name: '45-55', finishers: 35, upper_bound: 55 },
        { name: '55-65', finishers: 35, upper_bound: 65 },
        { name: '65-75', finishers: 15, upper_bound: 75 },
        { name: '>75', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
  },
  sprint: {
    swim: {
      buckets: [
        { name: '<12', finishers: 15, upper_bound: 12 },
        { name: '12-15', finishers: 30, upper_bound: 15 },
        { name: '15-18', finishers: 35, upper_bound: 18 },
        { name: '18-21', finishers: 15, upper_bound: 21 },
        { name: '>21', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<35', finishers: 10, upper_bound: 35 },
        { name: '35-40', finishers: 25, upper_bound: 40 },
        { name: '40-45', finishers: 35, upper_bound: 45 },
        { name: '45-50', finishers: 20, upper_bound: 50 },
        { name: '>50', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    run: {
      buckets: [
        { name: '<22', finishers: 10, upper_bound: 22 },
        { name: '22-26', finishers: 25, upper_bound: 26 },
        { name: '26-30', finishers: 35, upper_bound: 30 },
        { name: '30-34', finishers: 20, upper_bound: 34 },
        { name: '>34', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
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

const DistributionBarChart = ({ chartData, activeValue, yAxisLabel }: any) => {
  const data = chartData.buckets;
  const activeIndex = useMemo(() => {
    if (activeValue === 0) return -1;
    const foundIndex = data.findIndex(
      (bucket: any) => activeValue < bucket.upper_bound
    );
    return foundIndex === -1 ? data.length - 1 : foundIndex;
  }, [activeValue, data]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="hsl(var(--border) / 0.5)"
        />
        <XAxis
          dataKey="name"
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          interval={0}
        />
        <YAxis
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          label={{
            value: yAxisLabel,
            angle: -90,
            position: 'insideLeft',
            fill: 'hsl(var(--foreground))',
            style: { textAnchor: 'middle' },
          }}
        />
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
        />
        <Bar dataKey="finishers" radius={[4, 4, 0, 0]}>
          {data.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}`}
              fill={
                index === activeIndex
                  ? 'hsl(var(--primary))'
                  : 'hsl(var(--accent) / 0.6)'
              }
              className="transition-colors duration-300"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export function ResultsChart({
  totalTime,
  swimTime,
  bikeTime,
  runTime,
  distance,
}: ResultsChartProps) {
  const totalHours = timeToHours(totalTime);
  const swimMinutes = timeToMinutes(swimTime);
  const bikeHours = timeToHours(bikeTime);
  const runHours = timeToHours(runTime);
  const swimMinutesOlympic = timeToMinutes(swimTime);
  const bikeMinutesOlympic = timeToMinutes(bikeTime);
  const runMinutesOlympic = timeToMinutes(runTime);
  const swimMinutesSprint = timeToMinutes(swimTime);
  const bikeMinutesSprint = timeToMinutes(bikeTime);
  const runMinutesSprint = timeToMinutes(runTime);

  const charts = {
    total: {
      data: totalTimeDistributionData[distance],
      value: totalHours,
      label: `Finishers (%)`,
    },
    swim: {
      data: disciplineDistributionData[distance].swim,
      value:
        distance === 'olympic'
          ? swimMinutesOlympic
          : distance === 'sprint'
          ? swimMinutesSprint
          : swimMinutes,
      label: `Swimmers (%)`,
    },
    bike: {
      data: disciplineDistributionData[distance].bike,
      value:
        distance === 'olympic'
          ? bikeMinutesOlympic
          : distance === 'sprint'
          ? bikeMinutesSprint
          : bikeHours,
      label: `Bikers (%)`,
    },
    run: {
      data: disciplineDistributionData[distance].run,
      value:
        distance === 'olympic'
          ? runMinutesOlympic
          : distance === 'sprint'
          ? runMinutesSprint
          : runHours,
      label: `Runners (%)`,
    },
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight">
          Performance Analysis
        </CardTitle>
        <CardDescription>
          See where your times stack up against typical distributions.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pt-0 px-2 sm:px-4">
        <Accordion type="single" collapsible defaultValue="total" className="w-full">
          <AccordionItem value="total">
            <AccordionTrigger>Total Time Distribution</AccordionTrigger>
            <AccordionContent>
              <DistributionBarChart
                chartData={charts.total.data}
                activeValue={charts.total.value}
                yAxisLabel={charts.total.label}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="swim">
            <AccordionTrigger>Swim Time Distribution</AccordionTrigger>
            <AccordionContent>
              <DistributionBarChart
                chartData={charts.swim.data}
                activeValue={charts.swim.value}
                yAxisLabel={charts.swim.label}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="bike">
            <AccordionTrigger>Bike Time Distribution</AccordionTrigger>
            <AccordionContent>
              <DistributionBarChart
                chartData={charts.bike.data}
                activeValue={charts.bike.value}
                yAxisLabel={charts.bike.label}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="run">
            <AccordionTrigger>Run Time Distribution</AccordionTrigger>
            <AccordionContent>
              <DistributionBarChart
                chartData={charts.run.data}
                activeValue={charts.run.value}
                yAxisLabel={charts.run.label}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
