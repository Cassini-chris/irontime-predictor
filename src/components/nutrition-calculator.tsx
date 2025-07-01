'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Time } from '@/components/iron-time-predictor';
import { Flame } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface NutritionCalculatorProps {
  bikeTime: Time;
  runTime: Time;
}

const timeToHours = (time: Time) => time.h + time.m / 60 + time.s / 3600;

const CARBS_PER_GEL = 25; // Maurten Gel 100 has 25g of carbs

export function NutritionCalculator({
  bikeTime,
  runTime,
}: NutritionCalculatorProps) {
  const [carbsPerHour, setCarbsPerHour] = useState(90);

  const bikeHours = useMemo(() => timeToHours(bikeTime), [bikeTime]);
  const runHours = useMemo(() => timeToHours(runTime), [runTime]);

  const bikeCarbs = Math.round(bikeHours * carbsPerHour);
  const runCarbs = Math.round(runHours * carbsPerHour);
  const totalCarbs = bikeCarbs + runCarbs;

  const bikeGels = bikeCarbs > 0 ? Math.ceil(bikeCarbs / CARBS_PER_GEL) : 0;
  const runGels = runCarbs > 0 ? Math.ceil(runCarbs / CARBS_PER_GEL) : 0;
  const totalGels = bikeGels + runGels;

  const hasActivity = bikeHours > 0 || runHours > 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
          <Flame className="text-primary" />
          Carb Fueling Plan
        </CardTitle>
        <CardDescription>
          Estimate your carbohydrate needs for the bike and run based on your
          times. Assumes Maurten Gels (25g).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label htmlFor="carbs-slider" className="font-medium">
            Carbs per Hour: <span className="font-bold">{carbsPerHour}g</span>
          </Label>
          <Slider
            id="carbs-slider"
            min={60}
            max={120}
            step={5}
            value={[carbsPerHour]}
            onValueChange={(value) => setCarbsPerHour(value[0])}
          />
        </div>

        {hasActivity ? (
          <div className="space-y-4 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Bike</p>
                <p className="text-2xl font-bold">{bikeCarbs}g</p>
                <p className="text-xs text-muted-foreground">~{bikeGels} gels</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Run</p>
                <p className="text-2xl font-bold">{runCarbs}g</p>
                <p className="text-xs text-muted-foreground">~{runGels} gels</p>
              </div>
            </div>
            <div className="bg-primary/10 text-primary-foreground p-4 rounded-lg">
              <p className="text-lg font-bold text-primary">Total Fuel Needed</p>
              <p className="text-3xl font-bold text-primary">{totalCarbs}g</p>
              <p className="text-sm text-primary/80">
                Approximately {totalGels} gels
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground pt-4">
            Enter your bike or run time to calculate fueling needs.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
