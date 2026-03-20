'use client';

import { useTheme } from 'next-themes';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import {
  IronTimePredictor,
  type Time,
  type DistanceKey,
} from '@/components/iron-time-predictor';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function Home() {
  const { theme } = useTheme();

  // Lifted state from IronTimePredictor with persistence
  const [swimTime, setSwimTime] = useLocalStorageState<Time>('tri-swim-time', { h: 1, m: 15, s: 0 });
  const [t1Time, setT1Time] = useLocalStorageState<Time>('tri-t1-time', { h: 0, m: 8, s: 0 });
  const [bikeTime, setBikeTime] = useLocalStorageState<Time>('tri-bike-time', { h: 6, m: 0, s: 0 });
  const [t2Time, setT2Time] = useLocalStorageState<Time>('tri-t2-time', { h: 0, m: 6, s: 0 });
  const [runTime, setRunTime] = useLocalStorageState<Time>('tri-run-time', { h: 4, m: 31, s: 0 });
  const [distance, setDistance] = useLocalStorageState<DistanceKey>('tri-distance', 'full');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="w-full max-w-6xl space-y-8">
          <PageHeader
            title="IronTime Predictor"
            description="A calculator for your total Triathlon Time"
          />

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

          <div className="mt-16 pt-16 border-t border-border/50 max-w-4xl mx-auto space-y-12">
            <section>
              <h2 className="text-3xl font-headline font-bold mb-4 tracking-tight text-foreground">How to Pace a Full Ironman</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pacing a full-distance triathlon (3.8km swim, 180km bike, 42.2km run) is often called an eating and drinking contest with a little exercise mixed in. 
                The golden rule of Ironman pacing is discipline: executing a steady sub-threshold effort all day. 
                Using the IronTime Predictor, you can reverse-engineer your target finish time into manageable splits and print a custom pace band to wear on race day. 
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                On the bike, aim for a normalized power (NP) or heart rate that is about 65-75% of your FTP (Functional Threshold Power) or Lactate Threshold Heart Rate (LTHR). Going too hard on the bike is the #1 reason athletes end up walking the marathon. Your run pace should realistically be 15-30 seconds slower per kilometer than your standalone open marathon pace.
              </p>
            </section>
            
            <section>
              <h2 className="text-3xl font-headline font-bold mb-4 tracking-tight text-foreground">The Science Behind Triathlon Time Predictions</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Predicting triathlon times accurately isn't as simple as adding up your personal bests in swimming, cycling, and running. 
                The compounding effect of fatigue drastically changes your economy in each discipline. 
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The math behind our triathlon calculators adjusts pacing for accumulated fatigue. For example, your metabolic cost to run at a specific pace increases significantly after a 180km bike ride due to glycogen depletion, core temperature rising, and muscular breakdown. By inputting your training paces or goals into the IronTime Predictor, we provide you with a realistic, mathematically sound pacing band that accounts for transition times (T1 & T2) and typical fatigue factors, keeping you on track for a new PR.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-headline font-bold mb-4 tracking-tight text-foreground">Common Pacing Mistakes on Race Day</h2>
              <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                <li><strong>Swimming too hard early on:</strong> Going anaerobic in the first 400m to catch a fast draft pack. The seconds saved are almost never worth the massive energy expenditure.</li>
                <li><strong>Spiking power on hills:</strong> On the bike, maintain an even effort, not an even speed. Keep your power cap strict on short steep climbs and push slightly on descents or flats to maintain momentum.</li>
                <li><strong>Ignoring nutrition:</strong> Pacing is directly tied to nutrition. If you fall behind on your carbohydrate intake (aiming for 60-90g per hour), your pace will drop, no matter how fit you are.</li>
                <li><strong>Starting the run at open marathon pace:</strong> The first few kilometers off the bike often feel deceivingly easy. Stick rigidly to your predicted triathlon-run pace; banking time in the first half of the marathon almost always results in a complete bonk in the last 10k.</li>
              </ul>
            </section>
          </div>
        </div>
      </main >
      <PageFooter />
    </div >
  );
}
