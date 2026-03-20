'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { SteppableInput } from '@/components/ui/steppable-input';

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

  const mRef = React.useRef<HTMLInputElement>(null);
  const sRef = React.useRef<HTMLInputElement>(null);

  const handleValueChange = (field: keyof Pace, value: string) => {
    if (field === 'm' && value.length >= 2) {
      sRef.current?.focus();
      sRef.current?.select();
    }
  };

  const handleNumericChange = (field: keyof Pace, numericValue: number) => {
    let clampedValue = Math.max(0, numericValue);
    if (field === 's') {
      clampedValue = Math.max(0, Math.min(59, numericValue));
    }

    setPace({ ...pace, [field]: clampedValue });
  };

  const handleKeyDown = (field: keyof Pace, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && field === 's') {
      mRef.current?.focus();
      mRef.current?.select();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
        Pace <span className="text-primary/60">({unit})</span>
      </Label>
      <div className="flex items-start gap-1 sm:gap-2">
        <div className="grid w-full min-w-0 flex-1 gap-1.5 text-center">
          <SteppableInput
            ref={mRef}
            id={mId}
            value={pace.m}
            onChange={(val) => handleNumericChange('m', val)}
            onValueChange={(val) => handleValueChange('m', val)}
            onKeyDown={(e) => handleKeyDown('m', e)}
            onFocus={(e) => e.target.select()}
            placeholder="0"
            aria-label="Pace minutes"
            min={0}
            className="text-lg h-12"
          />
          <Label htmlFor={mId} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Min
          </Label>
        </div>
        <span className="pt-3 font-bold text-muted-foreground">:</span>
        <div className="grid w-full min-w-0 flex-1 gap-1.5 text-center">
          <SteppableInput
            ref={sRef}
            id={sId}
            value={pace.s}
            onChange={(val) => handleNumericChange('s', val)}
            onValueChange={(val) => handleValueChange('s', val)}
            onKeyDown={(e) => handleKeyDown('s', e)}
            onFocus={(e) => e.target.select()}
            placeholder="00"
            aria-label="Pace seconds"
            min={0}
            max={59}
            className="text-lg h-12"
          />
          <Label htmlFor={sId} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Sec
          </Label>
        </div>
      </div>
    </div>
  );
}
