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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

interface RunResultsChartProps {
    distance: number; // in km
    durationSeconds: number;
    label?: string;
}

const RUN_DISTRIBUTIONS = {
    '5k': {
        name: '5k Run',
        buckets: [
            { name: '<20', finishers: 4, upper_bound: 20 },
            { name: '20-22', finishers: 8, upper_bound: 22 },
            { name: '22-24', finishers: 14, upper_bound: 24 },
            { name: '24-26', finishers: 18, upper_bound: 26 },
            { name: '26-28', finishers: 20, upper_bound: 28 },
            { name: '28-30', finishers: 15, upper_bound: 30 },
            { name: '30-32', finishers: 10, upper_bound: 32 },
            { name: '32-35', finishers: 7, upper_bound: 35 },
            { name: '>35', finishers: 4, upper_bound: Infinity },
        ],
        unit: 'Minutes',
    },
    '10k': {
        name: '10k Run',
        buckets: [
            { name: '<40', finishers: 4, upper_bound: 40 },
            { name: '40-45', finishers: 8, upper_bound: 45 },
            { name: '45-50', finishers: 16, upper_bound: 50 },
            { name: '50-55', finishers: 22, upper_bound: 55 },
            { name: '55-60', finishers: 20, upper_bound: 60 },
            { name: '60-65', finishers: 14, upper_bound: 65 },
            { name: '65-70', finishers: 9, upper_bound: 70 },
            { name: '70-75', finishers: 4, upper_bound: 75 },
            { name: '>75', finishers: 3, upper_bound: Infinity },
        ],
        unit: 'Minutes',
    },
    'half': {
        name: 'Half Marathon',
        buckets: [
            { name: '<1:30', finishers: 5, upper_bound: 90 },
            { name: '1:30-1:40', finishers: 10, upper_bound: 100 },
            { name: '1:40-1:50', finishers: 18, upper_bound: 110 },
            { name: '1:50-2:00', finishers: 25, upper_bound: 120 },
            { name: '2:00-2:10', finishers: 20, upper_bound: 130 },
            { name: '2:10-2:20', finishers: 12, upper_bound: 140 },
            { name: '2:20-2:30', finishers: 5, upper_bound: 150 },
            { name: '2:30-2:45', finishers: 3, upper_bound: 165 },
            { name: '>2:45', finishers: 2, upper_bound: Infinity },
        ],
        unit: 'Minutes',
    },
    'marathon': {
        name: 'Marathon',
        buckets: [
            { name: '<3:00', finishers: 4, upper_bound: 180 },
            { name: '3:00-3:15', finishers: 8, upper_bound: 195 },
            { name: '3:15-3:30', finishers: 12, upper_bound: 210 },
            { name: '3:30-3:45', finishers: 15, upper_bound: 225 },
            { name: '3:45-4:00', finishers: 15, upper_bound: 240 },
            { name: '4:00-4:15', finishers: 18, upper_bound: 255 },
            { name: '4:15-4:30', finishers: 14, upper_bound: 270 },
            { name: '4:30-4:45', finishers: 8, upper_bound: 285 },
            { name: '4:45-5:00', finishers: 4, upper_bound: 300 },
            { name: '>5:00', finishers: 2, upper_bound: Infinity },
        ],
        unit: 'Minutes',
    }
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-lg shadow-lg text-xs">
                <p className="label font-bold">{`Range: ${label}`}</p>
                <p className="intro text-muted-foreground">{`Runners: ~${payload[0].value}%`}</p>
            </div>
        );
    }
    return null;
};

export function RunResultsChart({ distance, durationSeconds, label }: RunResultsChartProps) {
    // Determine if this is a standard distance
    const config = useMemo(() => {
        // Tolerances for distance matching
        if (Math.abs(distance - 5) < 0.1) return RUN_DISTRIBUTIONS['5k'];
        if (Math.abs(distance - 10) < 0.1) return RUN_DISTRIBUTIONS['10k'];
        if (Math.abs(distance - 21.0975) < 0.2 || Math.abs(distance - 21.1) < 0.2) return RUN_DISTRIBUTIONS['half'];
        if (Math.abs(distance - 42.195) < 0.5 || Math.abs(distance - 42.2) < 0.5) return RUN_DISTRIBUTIONS['marathon'];
        return null;
    }, [distance]);

    const activeIndex = useMemo(() => {
        if (!config || durationSeconds === 0) return -1;
        const minutes = durationSeconds / 60;
        const foundIndex = config.buckets.findIndex(
            (bucket) => minutes < bucket.upper_bound
        );
        return foundIndex === -1 ? config.buckets.length - 1 : foundIndex;
    }, [config, durationSeconds]);

    if (!config) return null;

    return (
        <Card className="mt-8 shadow-sm border-primary/10">
            <CardHeader className="py-4">
                <CardTitle className="text-lg font-headline">Performance Analysis: {config.name}</CardTitle>
                <CardDescription className="text-xs">
                    See where your time stacks up against typical runners.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4 px-2">
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={config.buckets}
                        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
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
                            height={50}
                        />
                        <YAxis hide />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
                        />
                        <Bar dataKey="finishers" radius={[4, 4, 0, 0]}>
                            {config.buckets.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        index === activeIndex
                                            ? 'hsl(var(--primary))'
                                            : 'hsl(var(--accent) / 0.4)'
                                    }
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
