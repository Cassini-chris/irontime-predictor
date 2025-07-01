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
      { name: '<8.5h', finishers: 1, upper_bound: 8.5 },
      { name: '8.5-9h', finishers: 2, upper_bound: 9 },
      { name: '9-9.5h', finishers: 4, upper_bound: 9.5 },
      { name: '9.5-10h', finishers: 6, upper_bound: 10 },
      { name: '10-10.5h', finishers: 8, upper_bound: 10.5 },
      { name: '10.5-11h', finishers: 10, upper_bound: 11 },
      { name: '11-11.5h', finishers: 12, upper_bound: 11.5 },
      { name: '11.5-12h', finishers: 13, upper_bound: 12 },
      { name: '12-12.5h', finishers: 12, upper_bound: 12.5 },
      { name: '12.5-13h', finishers: 10, upper_bound: 13 },
      { name: '13-13.5h', finishers: 8, upper_bound: 13.5 },
      { name: '13.5-14h', finishers: 6, upper_bound: 14 },
      { name: '14-14.5h', finishers: 4, upper_bound: 14.5 },
      { name: '14.5-15h', finishers: 2, upper_bound: 15 },
      { name: '15-15.5h', finishers: 1, upper_bound: 15.5 },
      { name: '>15.5h', finishers: 1, upper_bound: Infinity },
    ],
    unit: 'Hours',
  },
  half: {
    buckets: [
      { name: '<4:15', finishers: 2, upper_bound: 4.25 },
      { name: '4:15-4:30', finishers: 5, upper_bound: 4.5 },
      { name: '4:30-4:45', finishers: 9, upper_bound: 4.75 },
      { name: '4:45-5:00', finishers: 12, upper_bound: 5 },
      { name: '5:00-5:15', finishers: 14, upper_bound: 5.25 },
      { name: '5:15-5:30', finishers: 15, upper_bound: 5.5 },
      { name: '5:30-5:45', finishers: 13, upper_bound: 5.75 },
      { name: '5:45-6:00', finishers: 10, upper_bound: 6 },
      { name: '6:00-6:15', finishers: 8, upper_bound: 6.25 },
      { name: '6:15-6:30', finishers: 5, upper_bound: 6.5 },
      { name: '6:30-6:45', finishers: 4, upper_bound: 6.75 },
      { name: '>6:45', finishers: 3, upper_bound: Infinity },
    ],
    unit: 'Hours',
  },
  olympic: {
    buckets: [
      { name: '<2:08', finishers: 4, upper_bound: 2.13 },
      { name: '2:08-2:15', finishers: 8, upper_bound: 2.25 },
      { name: '2:15-2:22', finishers: 12, upper_bound: 2.37 },
      { name: '2:22-2:30', finishers: 15, upper_bound: 2.5 },
      { name: '2:30-2:38', finishers: 18, upper_bound: 2.63 },
      { name: '2:38-2:45', finishers: 15, upper_bound: 2.75 },
      { name: '2:45-2:52', finishers: 10, upper_bound: 2.87 },
      { name: '2:52-3:00', finishers: 8, upper_bound: 3 },
      { name: '3:00-3:08', finishers: 5, upper_bound: 3.13 },
      { name: '>3:08', finishers: 5, upper_bound: Infinity },
    ],
    unit: 'H:MM',
  },
  sprint: {
    buckets: [
      { name: '<1:05', finishers: 7, upper_bound: 1.08 },
      { name: '1:05-1:10', finishers: 10, upper_bound: 1.16 },
      { name: '1:10-1:15', finishers: 15, upper_bound: 1.25 },
      { name: '1:15-1:20', finishers: 18, upper_bound: 1.33 },
      { name: '1:20-1:25', finishers: 18, upper_bound: 1.42 },
      { name: '1:25-1:30', finishers: 13, upper_bound: 1.5 },
      { name: '1:30-1:35', finishers: 9, upper_bound: 1.58 },
      { name: '1:35-1:40', finishers: 6, upper_bound: 1.66 },
      { name: '>1:40', finishers: 4, upper_bound: Infinity },
    ],
    unit: 'H:MM',
  },
};

const disciplineDistributionData = {
  full: {
    swim: {
      buckets: [
        { name: '<55', finishers: 4, upper_bound: 55 },
        { name: '55-60', finishers: 8, upper_bound: 60 },
        { name: '60-65', finishers: 13, upper_bound: 65 },
        { name: '65-70', finishers: 18, upper_bound: 70 },
        { name: '70-75', finishers: 20, upper_bound: 75 },
        { name: '75-80', finishers: 15, upper_bound: 80 },
        { name: '80-85', finishers: 10, upper_bound: 85 },
        { name: '85-90', finishers: 7, upper_bound: 90 },
        { name: '>90', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<4:45', finishers: 2, upper_bound: 4.75 },
        { name: '4:45-5:00', finishers: 5, upper_bound: 5 },
        { name: '5:00-5:15', finishers: 9, upper_bound: 5.25 },
        { name: '5:15-5:30', finishers: 13, upper_bound: 5.5 },
        { name: '5:30-5:45', finishers: 16, upper_bound: 5.75 },
        { name: '5:45-6:00', finishers: 16, upper_bound: 6 },
        { name: '6:00-6:15', finishers: 13, upper_bound: 6.25 },
        { name: '6:15-6:30', finishers: 9, upper_bound: 6.5 },
        { name: '6:30-6:45', finishers: 7, upper_bound: 6.75 },
        { name: '>6:45', finishers: 10, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
    run: {
      buckets: [
        { name: '<3:15', finishers: 4, upper_bound: 3.25 },
        { name: '3:15-3:30', finishers: 7, upper_bound: 3.5 },
        { name: '3:30-3:45', finishers: 10, upper_bound: 3.75 },
        { name: '3:45-4:00', finishers: 14, upper_bound: 4 },
        { name: '4:00-4:15', finishers: 18, upper_bound: 4.25 },
        { name: '4:15-4:30', finishers: 18, upper_bound: 4.5 },
        { name: '4:30-4:45', finishers: 13, upper_bound: 4.75 },
        { name: '4:45-5:00', finishers: 9, upper_bound: 5 },
        { name: '>5:00', finishers: 7, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
  },
  half: {
    swim: {
      buckets: [
        { name: '<28', finishers: 5, upper_bound: 28 },
        { name: '28-31', finishers: 12, upper_bound: 31 },
        { name: '31-34', finishers: 20, upper_bound: 34 },
        { name: '34-37', finishers: 23, upper_bound: 37 },
        { name: '37-40', finishers: 18, upper_bound: 40 },
        { name: '40-43', finishers: 12, upper_bound: 43 },
        { name: '43-46', finishers: 7, upper_bound: 46 },
        { name: '>46', finishers: 3, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<2:15', finishers: 4, upper_bound: 2.25 },
        { name: '2:15-2:30', finishers: 8, upper_bound: 2.5 },
        { name: '2:30-2:45', finishers: 15, upper_bound: 2.75 },
        { name: '2:45-3:00', finishers: 20, upper_bound: 3 },
        { name: '3:00-3:15', finishers: 22, upper_bound: 3.25 },
        { name: '3:15-3:30', finishers: 15, upper_bound: 3.5 },
        { name: '3:30-3:45', finishers: 9, upper_bound: 3.75 },
        { name: '>3:45', finishers: 7, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
    run: {
      buckets: [
        { name: '<1:40', finishers: 5, upper_bound: 1.66 },
        { name: '1:40-1:50', finishers: 15, upper_bound: 1.83 },
        { name: '1:50-2:00', finishers: 25, upper_bound: 2.0 },
        { name: '2:00-2:10', finishers: 25, upper_bound: 2.16 },
        { name: '2:10-2:20', finishers: 15, upper_bound: 2.33 },
        { name: '2:20-2:30', finishers: 10, upper_bound: 2.5 },
        { name: '>2:30', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Hours',
    },
  },
  olympic: {
    swim: {
      buckets: [
        { name: '<22.5', finishers: 6, upper_bound: 22.5 },
        { name: '22.5-25', finishers: 11, upper_bound: 25 },
        { name: '25-27.5', finishers: 17, upper_bound: 27.5 },
        { name: '27.5-30', finishers: 20, upper_bound: 30 },
        { name: '30-32.5', finishers: 18, upper_bound: 32.5 },
        { name: '32.5-35', finishers: 12, upper_bound: 35 },
        { name: '35-37.5', finishers: 8, upper_bound: 37.5 },
        { name: '37.5-40', finishers: 5, upper_bound: 40 },
        { name: '>40', finishers: 3, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<60', finishers: 4, upper_bound: 60 },
        { name: '60-65', finishers: 8, upper_bound: 65 },
        { name: '65-70', finishers: 15, upper_bound: 70 },
        { name: '70-75', finishers: 20, upper_bound: 75 },
        { name: '75-80', finishers: 22, upper_bound: 80 },
        { name: '80-85', finishers: 15, upper_bound: 85 },
        { name: '85-90', finishers: 9, upper_bound: 90 },
        { name: '>90', finishers: 7, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    run: {
      buckets: [
        { name: '<40', finishers: 4, upper_bound: 40 },
        { name: '40-45', finishers: 8, upper_bound: 45 },
        { name: '45-50', finishers: 16, upper_bound: 50 },
        { name: '50-55', finishers: 22, upper_bound: 55 },
        { name: '55-60', finishers: 20, upper_bound: 60 },
        { name: '60-65', finishers: 14, upper_bound: 65 },
        { name: '65-70', finishers: 9, upper_bound: 70 },
        { name: '>70', finishers: 7, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
  },
  sprint: {
    swim: {
      buckets: [
        { name: '<12', finishers: 10, upper_bound: 12 },
        { name: '12-14', finishers: 20, upper_bound: 14 },
        { name: '14-16', finishers: 30, upper_bound: 16 },
        { name: '16-18', finishers: 20, upper_bound: 18 },
        { name: '18-20', finishers: 10, upper_bound: 20 },
        { name: '20-22', finishers: 5, upper_bound: 22 },
        { name: '>22', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    bike: {
      buckets: [
        { name: '<32', finishers: 4, upper_bound: 32 },
        { name: '32-35', finishers: 8, upper_bound: 35 },
        { name: '35-37.5', finishers: 13, upper_bound: 37.5 },
        { name: '37.5-40', finishers: 18, upper_bound: 40 },
        { name: '40-42.5', finishers: 20, upper_bound: 42.5 },
        { name: '42.5-45', finishers: 15, upper_bound: 45 },
        { name: '45-47.5', finishers: 10, upper_bound: 47.5 },
        { name: '47.5-50', finishers: 7, upper_bound: 50 },
        { name: '>50', finishers: 5, upper_bound: Infinity },
      ],
      unit: 'Minutes',
    },
    run: {
      buckets: [
        { name: '<20', finishers: 4, upper_bound: 20 },
        { name: '20-22', finishers: 8, upper_bound: 22 },
        { name: '22-24', finishers: 14, upper_bound: 24 },
        { name: '24-26', finishers: 18, upper_bound: 26 },
        { name: '26-28', finishers: 20, upper_bound: 28 },
        { name: '28-30', finishers: 15, upper_bound: 30 },
        { name: '30-32', finishers: 10, upper_bound: 32 },
        { name: '32-34', finishers: 7, upper_bound: 34 },
        { name: '>34', finishers: 4, upper_bound: Infinity },
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
          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={40}
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
            offset: -10,
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
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
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
