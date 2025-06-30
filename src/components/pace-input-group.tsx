'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Pace = { m: number; s: number };

interface PaceInputGroupProps {
  unit: string;
  pace: Pace;
  setPace: (pace: Pace) => void;
}

export function PaceInputGroup({
  unit,
  pace,
  setPace,
}: PaceInputGroupProps) {
  const mId = React.useId();
  const sId = React.useId();

  const handleInputChange = (field: keyof Pace, value: string) => {
    let numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) {
      numericValue = 0;
    }

    let clampedValue = Math.max(0, numericValue);
    if (field === 's') {
      clampedValue = Math.max(0, Math.min(59, numericValue));
    }

    setPace({ ...pace, [field]: clampedValue });
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        Pace <span className="text-muted-foreground">({unit})</span>
      </Label>
      <div className="flex items-start gap-2">
        <div className="grid w-full gap-1.5 text-center">
          <Input
            id={mId}
            type="number"
            value={String(pace.m)}
            onChange={(e) => handleInputChange('m', e.target.value)}
            placeholder="MM"
            aria-label="Pace minutes"
            min="0"
            className="font-mono text-center"
          />
          <Label htmlFor={mId} className="text-xs text-muted-foreground">
            Min
          </Label>
        </div>
        <span className="pt-2 font-bold text-muted-foreground">:</span>
        <div className="grid w-full gap-1.5 text-center">
          <Input
            id={sId}
            type="number"
            value={String(pace.s).padStart(2, '0')}
            onFocus={(e) => e.target.select()}
            onChange={(e) => handleInputChange('s', e.target.value)}
            placeholder="SS"
            aria-label="Pace seconds"
            min="0"
            max="59"
            className="font-mono text-center"
          />
          <Label htmlFor={sId} className="text-xs text-muted-foreground">
            Sec
          </Label>
        </div>
      </div>
    </div>
  );
}
