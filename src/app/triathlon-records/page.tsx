'use client';

import { Waves, Bike, Activity, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

type Gender = 'men' | 'women';

export default function TriathlonRecordsPage() {
    const [gender, setGender] = useLocalStorageState<Gender>('triathlon-gender', 'men');

    // Data Maps
    const ironmanWorldRecord = {
        men: { time: '7:21:12', athlete: 'Kristian Blummenfelt (NOR)', location: 'Cozumel (Current-Assisted)', date: '2021', swim: '39:41', bike: '4:02:40', run: '2:35:24' },
        women: { time: '8:02:38', athlete: 'Anne Haug (GER)', location: 'Challenge Roth', date: '2024', swim: '52:37', bike: '4:27:58', run: '2:38:52' }
    };

    const worldChampionshipRecords = {
        men: [
            { title: 'IM World Championship (Nice 2025)', time: '7:51:39', athlete: 'Casper Stornes (NOR)', location: 'Nice, FRA', date: '2025', swim: '46:48', bike: '4:30:12', run: '2:29:25', note: 'First sub-2:30 marathon in WC history' },
            { title: 'IM World Championship (Kona)', time: '7:35:53', athlete: 'Patrick Lange (GER)', location: 'Kona, HI', date: '2024', swim: '47:09', bike: '4:06:22', run: '2:37:34' }
        ],
        women: [
            { title: 'IM World Championship (Kona)', time: '8:24:31', athlete: 'Lucy Charles-Barclay (GBR)', location: 'Kona, HI', date: '2023', swim: '49:36', bike: '4:32:29', run: '2:57:38' }
        ]
    };

    const rothRecord = {
        men: { time: '7:23:24', athlete: 'Magnus Ditlev (DEN)', location: 'Roth, GER', date: '2024', swim: '46:23', bike: '3:59:25', run: '2:34:18' },
        women: { time: '8:02:38', athlete: 'Anne Haug (GER)', location: 'Roth, GER', date: '2024', swim: '52:37', bike: '4:27:58', run: '2:38:52' }
    };

    const fastestSplits = {
        men: {
            swim: { time: '38:06', athlete: 'Barrett Brandon (USA)', race: 'IM Chattanooga 2014 (River)' },
            bike: { time: '3:53:32', athlete: 'Cameron Wurf (AUS)', race: 'IM Texas 2025 (WR)' },
            run: { time: '2:29:25', athlete: 'Casper Stornes (NOR)', race: 'IM WC Nice 2025' },
            ultimate: '7:01:03'
        },
        women: {
            swim: { time: '39:56', athlete: 'Anna Cleaver (NZL)', race: 'IM Chattanooga 2014 (River)' },
            bike: { time: '4:22:56', athlete: 'Daniela Ryf (SUI)', race: 'Challenge Roth 2023' },
            run: { time: '2:38:27', athlete: 'Laura Philipp (GER)', race: 'IM Hamburg 2025' },
            ultimate: '7:41:19'
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PageHeader
                        title="Triathlon Course Records"
                        description="The fastest times across the full iron-distance (3.8k / 180k / 42.2k)."
                    />

                    <div className="flex justify-center my-8">
                        <div className="flex p-1 space-x-1 bg-muted rounded-xl">
                            <button
                                onClick={() => setGender('men')}
                                className={cn(
                                    'px-8 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
                                    gender === 'men' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                Men
                            </button>
                            <button
                                onClick={() => setGender('women')}
                                className={cn(
                                    'px-8 py-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer',
                                    gender === 'women' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                Women
                            </button>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-8 md:p-12 shadow-inner">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Trophy className="w-32 h-32 text-primary rotate-12" />
                            </div>
                            <div className="relative z-10 space-y-8">
                                <div className="text-center md:text-left space-y-2">
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">The Ultimate Record</span>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tight italic uppercase underline decoration-primary/30">Theoretical Fastest Ever</h2>
                                    <p className="text-muted-foreground max-w-2xl">Combining the absolute fastest individual splits ever recorded in competitive full-distance racing.</p>
                                </div>

                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-6 border-y border-primary/10">
                                    <div className="text-6xl md:text-8xl font-black text-primary tracking-tighter drop-shadow-sm shrink-0">
                                        {fastestSplits[gender].ultimate}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
                                        <UltimateSplit
                                            icon={<Waves className="w-5 h-5 text-blue-500" />}
                                            label="Fastest Swim"
                                            time={fastestSplits[gender].swim.time}
                                            athlete={fastestSplits[gender].swim.athlete}
                                            race={fastestSplits[gender].swim.race}
                                        />
                                        <UltimateSplit
                                            icon={<Bike className="w-5 h-5 text-orange-500" />}
                                            label="Fastest Bike"
                                            time={fastestSplits[gender].bike.time}
                                            athlete={fastestSplits[gender].bike.athlete}
                                            race={fastestSplits[gender].bike.race}
                                        />
                                        <UltimateSplit
                                            icon={<Activity className="w-5 h-5 text-green-500" />}
                                            label="Fastest Run"
                                            time={fastestSplits[gender].run.time}
                                            athlete={fastestSplits[gender].run.athlete}
                                            race={fastestSplits[gender].run.race}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="space-y-12">
                            <h3 className="text-2xl font-bold border-b pb-4">Major Professional Records</h3>
                            <RaceSection title="Full-Distance World Record" data={ironmanWorldRecord[gender]} />

                            {worldChampionshipRecords[gender].map((race, index) => (
                                <RaceSection
                                    key={index}
                                    title={race.title}
                                    data={race}
                                    highlight={index === 0}
                                />
                            ))}

                            <RaceSection title="Challenge Roth Course Record" data={rothRecord[gender]} />
                        </div>
                    </div>
                </div>
            </main>
            <PageFooter />
        </div>
    );
}

function UltimateSplit({ icon, label, time, athlete, race }: { icon: React.ReactNode, label: string, time: string, athlete: string, race: string }) {
    return (
        <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {icon} {label}
            </div>
            <div className="text-2xl font-black text-foreground">{time}</div>
            <div className="text-sm font-semibold truncate max-w-[150px]">{athlete}</div>
            <div className="text-[10px] text-muted-foreground truncate max-w-[150px]">{race}</div>
        </div>
    );
}

function RaceSection({ title, data, highlight = false }: { title: string, data: any, highlight?: boolean }) {
    return (
        <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm transition-all hover:shadow-md">
            <div className={cn("p-6 md:p-8 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4", highlight ? 'bg-primary/5' : '')}>
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Trophy className={cn("w-6 h-6", highlight ? "text-primary" : "text-muted-foreground")} />
                        {title}
                    </h2>
                    <div className="text-muted-foreground flex items-center gap-2">
                        <span className="font-medium text-foreground">{data.athlete}</span>
                        <span>•</span>
                        <span>{data.location || data.date}</span>
                        {data.location && <span>({data.date})</span>}
                    </div>
                    {data.note && (
                        <div className="text-xs font-bold text-primary uppercase tracking-tighter">{data.note}</div>
                    )}
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1 font-medium uppercase tracking-wider">Overall Time</div>
                    <div className="text-4xl font-black text-primary">{data.time}</div>
                </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-border bg-muted/30">
                <SplitCard icon={<Waves className="w-5 h-5 text-blue-500" />} label="Swim (3.8k)" time={data.swim} />
                <SplitCard icon={<Bike className="w-5 h-5 text-orange-500" />} label="Bike (180k)" time={data.bike} />
                <SplitCard icon={<Activity className="w-5 h-5 text-green-500" />} label="Run (42.2k)" time={data.run} />
            </div>
        </section>
    );
}

function SplitCard({ icon, label, time }: { icon: React.ReactNode, label: string, time: string }) {
    return (
        <div className="flex flex-col items-center text-center p-4 space-y-1 hover:bg-muted/50 transition-colors">
            <div className="p-2 bg-background rounded-full shadow-sm border border-border">
                {icon}
            </div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
            <div className="text-lg font-bold text-foreground">{time}</div>
        </div>
    );
}
