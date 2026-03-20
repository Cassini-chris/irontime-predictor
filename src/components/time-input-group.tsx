'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { SteppableInput } from '@/components/ui/steppable-input';

type Time = { h: number; m: number; s: number };

interface TimeInputGroupProps {
  label?: string;
  time: Time;
  setTime: (time: Time) => void;
}

export function TimeInputGroup({
  label,
  time,
  setTime,
}: TimeInputGroupProps) {
  const hId = React.useId();
  const mId = React.useId();
  const sId = React.useId();

  const hRef = React.useRef<HTMLInputElement>(null);
  const mRef = React.useRef<HTMLInputElement>(null);
  const sRef = React.useRef<HTMLInputElement>(null);

  const handleValueChange = (field: keyof Time, value: string) => {
    // Auto-tabbing logic
    if (value.length >= 2) {
      if (field === 'h') {
        mRef.current?.focus();
        mRef.current?.select();
      } else if (field === 'm') {
        sRef.current?.focus();
        sRef.current?.select();
      }
    }
  };

  const handleNumericChange = (field: keyof Time, numericValue: number) => {
    let clampedValue = numericValue;
    if (field === 'm' || field === 's') {
      clampedValue = Math.max(0, Math.min(59, numericValue));
    } else {
      clampedValue = Math.max(0, numericValue);
    }

    setTime({ ...time, [field]: clampedValue });
  };

  const handleKeyDown = (field: keyof Time, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '') {
      if (field === 'm') {
        hRef.current?.focus();
        hRef.current?.select();
      } else if (field === 's') {
        mRef.current?.focus();
        mRef.current?.select();
      }
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label className="font-medium">
          {label}
        </Label>
      )}
      <div className="flex items-start gap-1 sm:gap-2 shrink-0">
        <div className="grid w-full min-w-0 flex-1 gap-1.5 text-center">
          <SteppableInput
            ref={hRef}
            id={hId}
            value={time.h}
            onChange={(val) => handleNumericChange('h', val)}
            onValueChange={(val) => handleValueChange('h', val)}
            onKeyDown={(e) => handleKeyDown('h', e)}
            onFocus={(e) => e.target.select()}
            placeholder="0"
            aria-label={`${label || 'Time'} hours`}
            min={0}
            className="text-lg h-12"
          />
          <Label htmlFor={hId} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Hours
          </Label>
        </div>
        <span className="pt-3 font-bold text-muted-foreground">:</span>
        <div className="grid w-full min-w-0 flex-1 gap-1.5 text-center">
          <SteppableInput
            ref={mRef}
            id={mId}
            value={time.m}
            onChange={(val) => handleNumericChange('m', val)}
            onValueChange={(val) => handleValueChange('m', val)}
            onKeyDown={(e) => handleKeyDown('m', e)}
            onFocus={(e) => e.target.select()}
            placeholder="00"
            aria-label={`${label || 'Time'} minutes`}
            min={0}
            max={59}
            className="text-lg h-12"
          />
          <Label htmlFor={mId} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Minutes
          </Label>
        </div>
        <span className="pt-3 font-bold text-muted-foreground">:</span>
        <div className="grid w-full min-w-0 flex-1 gap-1.5 text-center">
          <SteppableInput
            ref={sRef}
            id={sId}
            value={time.s}
            onChange={(val) => handleNumericChange('s', val)}
            onValueChange={(val) => handleValueChange('s', val)}
            onKeyDown={(e) => handleKeyDown('s', e)}
            onFocus={(e) => e.target.select()}
            placeholder="00"
            aria-label={`${label || 'Time'} seconds`}
            min={0}
            max={59}
            className="text-lg h-12"
          />
          <Label htmlFor={sId} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
            Seconds
          </Label>
        </div>
      </div>
    </div>
  );
}
