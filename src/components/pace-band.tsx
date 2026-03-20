import { Time } from './iron-time-predictor';
import { Target, Waves, Bike, PersonStanding } from 'lucide-react';

interface PaceBandProps {
  swimTime: Time;
  t1Time: Time;
  bikeTime: Time;
  t2Time: Time;
  runTime: Time;
  distanceConfig: { swim: number; bike: number; run: number; name: string };
  totalTime: Time;
}

export function PrintablePaceBand({
  swimTime,
  t1Time,
  bikeTime,
  t2Time,
  runTime,
  distanceConfig,
  totalTime,
}: PaceBandProps) {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const timeToSeconds = (time: Time) => time.h * 3600 + time.m * 60 + time.s;

  let elapsed = 0;
  const swimSec = timeToSeconds(swimTime);
  const t1Sec = timeToSeconds(t1Time);
  const bikeSec = timeToSeconds(bikeTime);
  const t2Sec = timeToSeconds(t2Time);
  const runSec = timeToSeconds(runTime);

  const waypoints = [];

  if (swimSec > 0) {
    elapsed += swimSec;
    waypoints.push({ label: 'Swim out', time: elapsed, icon: <Waves className="w-4 h-4" /> });
  }
  if (t1Sec > 0) {
    elapsed += t1Sec;
    waypoints.push({ label: 'T1 out', time: elapsed });
  }
  if (bikeSec > 0) {
    elapsed += bikeSec;
    waypoints.push({ label: 'Bike in', time: elapsed, icon: <Bike className="w-4 h-4" /> });
  }
  if (t2Sec > 0) {
    elapsed += t2Sec;
    waypoints.push({ label: 'T2 out', time: elapsed });
  }

  // Run splits
  if (runSec > 0 && distanceConfig.run > 0) {
    const runPace = runSec / distanceConfig.run;
    const interval = distanceConfig.run > 21.1 ? 5 : 1;
    for (let i = interval; i < distanceConfig.run; i += interval) {
      waypoints.push({
        label: `Run ${i}km`,
        time: elapsed + i * runPace,
        icon: <PersonStanding className="w-4 h-4" />,
      });
    }
  }

  elapsed += runSec;
  waypoints.push({ label: 'FINISH', time: elapsed, icon: <Target className="w-4 h-4" /> });

  return (
    <div className="hidden print:flex flex-col items-center justify-center w-full min-h-screen bg-white text-black font-mono">
      <div className="border-4 border-black border-dashed p-4 rounded-xl max-w-sm w-full">
        <div className="text-center mb-6 border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-widest">{distanceConfig.name}</h1>
          <p className="text-sm">Target Time: {formatTime(timeToSeconds(totalTime))}</p>
        </div>
        
        <table className="w-full text-sm">
          <tbody>
            {waypoints.map((wp, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-3 px-2 flex items-center gap-2 font-semibold">
                  {wp.icon}
                  {wp.label}
                </td>
                <td className="py-3 px-2 text-right font-bold text-lg tabular-nums">
                  {formatTime(wp.time)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-6 text-center text-xs text-gray-500 uppercase tracking-widest">
          IronTime Predictor | runculator.com
        </div>
      </div>
    </div>
  );
}
