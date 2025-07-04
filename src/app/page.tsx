'use client';

import { useState, useEffect } from 'react';
import {
  IronTimePredictor,
  type Time,
  type DistanceKey,
} from '@/components/iron-time-predictor';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gift } from 'lucide-react';
import { CrystalBall } from '@/components/crystal-ball';

const zeroTime: Time = { h: 0, m: 0, s: 0 };

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  // Easter Egg states
  const [showCrystalBall, setShowCrystalBall] = useState(false);

  // Lifted state from IronTimePredictor
  const [swimTime, setSwimTime] = useState<Time>(zeroTime);
  const [t1Time, setT1Time] = useState<Time>({ h: 0, m: 5, s: 0 });
  const [bikeTime, setBikeTime] = useState<Time>(zeroTime);
  const [t2Time, setT2Time] = useState<Time>({ h: 0, m: 3, s: 0 });
  const [runTime, setRunTime] = useState<Time>(zeroTime);
  const [distance, setDistance] = useState<DistanceKey>('full');
  const [mainMode, setMainMode] = useState<'manual' | 'goal'>('manual');

  useEffect(() => {
    const hasSeenCrystalBall = sessionStorage.getItem('hasSeenCrystalBall');
    if (!hasSeenCrystalBall) {
      setShowCrystalBall(true);
    }
  }, []);

  const handlePrediction = (prediction: {
    swimTime: Time;
    t1Time: Time;
    bikeTime: Time;
    t2Time: Time;
    runTime: Time;
  }) => {
    setSwimTime(prediction.swimTime);
    setT1Time(prediction.t1Time);
    setBikeTime(prediction.bikeTime);
    setT2Time(prediction.t2Time);
    setRunTime(prediction.runTime);
    setDistance('full'); // Prediction is always for full
    setMainMode('manual'); // Switch to manual mode to show the filled times
  };

  const handleCrystalBallClose = () => {
    setShowCrystalBall(false);
    sessionStorage.setItem('hasSeenCrystalBall', 'true');
  };

  useEffect(() => {
    let explosionTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    if (showOverlay) {
      setIsExploding(false);
      explosionTimer = setTimeout(() => {
        setIsExploding(true);
      }, 3500);

      hideTimer = setTimeout(() => {
        setShowOverlay(false);
      }, 4000); // 3500ms for display + 500ms for explosion animation
    }

    return () => {
      clearTimeout(explosionTimer);
      clearTimeout(hideTimer);
    };
  }, [showOverlay]);

  const handleEasterEggClick = () => {
    if (!showOverlay) {
      setShowOverlay(true);
    }
  };

  return (
    <>
      {showCrystalBall && (
        <CrystalBall
          onPrediction={handlePrediction}
          onClose={handleCrystalBallClose}
        />
      )}
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
              <div>
                <Button onClick={handleEasterEggClick} variant="outline">
                  <Gift />
                  I have built this app for Roth 2025
                </Button>
              </div>
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
              mainMode={mainMode}
              setMainMode={setMainMode}
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

      {showOverlay && (
        <div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm',
            isExploding
              ? 'animate-out fade-out-0 zoom-out-150 duration-500'
              : 'animate-in fade-in-0 duration-300'
          )}
        >
          <div className="relative font-headline text-5xl md:text-7xl font-bold text-white text-center space-y-4">
            <div className="animate-in slide-in-from-bottom-16 fade-in-25 duration-700 delay-200">
              Felix
            </div>
            <div className="animate-in slide-in-from-bottom-16 fade-in-25 duration-700 delay-500">
              Chris
            </div>
            <div className="animate-in slide-in-from-bottom-16 fade-in-25 duration-700 delay-800">
              Mo
            </div>
            <div className="text-accent text-4xl md:text-6xl animate-in zoom-in-50 fade-in-0 duration-500 delay-1200">
              Go Go Go!
            </div>
          </div>
        </div>
      )}
    </>
  );
}
