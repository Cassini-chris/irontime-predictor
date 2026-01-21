'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import {
  IronTimePredictor,
  type Time,
  type DistanceKey,
} from '@/components/iron-time-predictor';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

const zeroTime: Time = { h: 0, m: 0, s: 0 };

export default function Home() {
  const { theme } = useTheme();

  // Lifted state from IronTimePredictor
  const [swimTime, setSwimTime] = useState<Time>(zeroTime);
  const [t1Time, setT1Time] = useState<Time>({ h: 0, m: 5, s: 0 });
  const [bikeTime, setBikeTime] = useState<Time>(zeroTime);
  const [t2Time, setT2Time] = useState<Time>({ h: 0, m: 3, s: 0 });
  const [runTime, setRunTime] = useState<Time>(zeroTime);
  const [distance, setDistance] = useState<DistanceKey>('full');

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
          <div className="w-full max-w-6xl space-y-8">
            <header className="text-center space-y-4 relative">
              <div className="absolute top-0 right-0">
                <ThemeToggle />
              </div>
              <div className="inline-flex items-center justify-center gap-2">
                <Logo className="h-10 w-10 text-primary" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-headline">
                  IronTime Predictor
                </h1>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A calculator for your Ironman total time. Input your discipline
                times to predict your finish.
              </p>
            </header>

            <IronTimePredictor
              swimTime={swimTime}
              setSwimTime={setSwimTime}
              t1Time={t1Time}
              setT1Time={setT1Time}
              bikeTime={bikeTime}
              setBikeTime={setBikeTime}
              t2Time={t2Time}
              setT2Time={setT2Time}
              runTime={runTime}
              setRunTime={setRunTime}
              distance={distance}
              setDistance={setDistance}
            />
          </div>
        </main>
        <footer className="w-full py-8 text-center text-muted-foreground text-sm">
          <p>
            &copy; {new Date().getFullYear()} IronTime Predictor. Unleash your
            potential.
          </p>
        </footer>
      </div>
    </>
  );
}
