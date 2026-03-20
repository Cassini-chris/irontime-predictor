'use client';

import { Trophy, Timer, MapPin, Footprints } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

type Gender = 'men' | 'women';

export default function AthleticsRecordsPage() {
    const [gender, setGender] = useLocalStorageState<Gender>('athletics-gender', 'men');

    // Data maps based on research
    const hundredMData = {
        men: { time: '9.58s', athlete: 'Usain Bolt (JAM)', date: 'Aug 16, 2009', location: 'Berlin' },
        women: { time: '10.49s', athlete: 'Florence Griffith-Joyner (USA)', date: 'Jul 16, 1988', location: 'Indianapolis' }
    };

    const twoHundredMData = {
        men: { time: '19.19s', athlete: 'Usain Bolt (JAM)', date: 'Aug 20, 2009', location: 'Berlin' },
        women: { time: '21.34s', athlete: 'Florence Griffith-Joyner (USA)', date: 'Sep 29, 1988', location: 'Seoul' }
    };

    const fourHundredMData = {
        men: { time: '43.03s', athlete: 'Wayde van Niekerk (RSA)', date: 'Aug 14, 2016', location: 'Rio de Janeiro' },
        women: { time: '47.60s', athlete: 'Marita Koch (GDR)', date: 'Oct 6, 1985', location: 'Canberra' }
    };

    const eightHundredMData = {
        men: { time: '1:40.91', athlete: 'David Rudisha (KEN)', date: 'Aug 9, 2012', location: 'London' },
        women: { time: '1:53.28', athlete: 'Jarmila Kratochvílová (TCH)', date: 'Jul 26, 1983', location: 'Munich' }
    };

    const fifteenHundredMData = {
        men: { time: '3:26.00', athlete: 'Hicham El Guerrouj (MAR)', date: 'Jul 14, 1998', location: 'Rome' },
        women: { time: '3:48.68', athlete: 'Faith Kipyegon (KEN)', date: 'Jul 5, 2025', location: 'Eugene' }
    };

    const mileData = {
        men: { time: '3:43.13', athlete: 'Hicham El Guerrouj (MAR)', date: 'Jul 7, 1999', location: 'Rome' },
        women: { time: '4:07.64', athlete: 'Faith Kipyegon (KEN)', date: 'Jul 21, 2023', location: 'Monaco' }
    };

    const fiveKData = {
        men: { time: '12:35.36', athlete: 'Joshua Cheptegei (UGA)', date: 'Aug 14, 2020', location: 'Monaco' },
        women: { time: '13:58.06', athlete: 'Beatrice Chebet (KEN)', date: 'Jul 5, 2025', location: 'Eugene' }
    };

    const tenKData = {
        men: { time: '26:11.00', athlete: 'Joshua Cheptegei (UGA)', date: 'Oct 7, 2020', location: 'Valencia' },
        women: { time: '28:54.14', athlete: 'Beatrice Chebet (KEN)', date: 'May 25, 2024', location: 'Eugene' }
    };

    const halfMarathonData = {
        men: { time: '57:30', athlete: 'Yomif Kejelcha (ETH)', date: 'Oct 27, 2024', location: 'Valencia' },
        women: { time: '1:02:52', athlete: 'Letesenbet Gidey (ETH)', date: 'Oct 24, 2021', location: 'Valencia' }
    };

    const marathonData = {
        men: { time: '2:00:35', athlete: 'Kelvin Kiptum (KEN)', date: 'Oct 8, 2023', location: 'Chicago' },
        women: { time: '2:09:56', athlete: 'Ruth Chepngetich (KEN)', date: 'Oct 13, 2024', location: 'Chicago' }
    };

    const fiftyKData = {
        men: { time: '2:42:07', athlete: 'Ketema Negasa (ETH)', date: 'May 23, 2021', location: 'Port Elizabeth' },
        women: { time: '2:59:54', athlete: 'Desiree Linden (USA)', date: 'Apr 13, 2021', location: 'Dorena Lake' }
    };

    const hundredKData = {
        men: { time: '6:05:35', athlete: 'Aleksandr Sorokin (LTU)', date: 'May 14, 2023', location: 'Vilnius' },
        women: { time: '6:33:11', athlete: 'Tomoe Abe (JPN)', date: 'Jun 25, 2000', location: 'Yūbetsu' }
    };

    const fiveKIndoorData = {
        men: { time: '12:44.09', athlete: 'Grant Fisher (USA)', date: 'Feb 14, 2025', location: 'Boston' },
        women: { time: '14:18.86', athlete: 'Genzebe Dibaba (ETH)', date: 'Feb 19, 2015', location: 'Stockholm' }
    };

    const wserData = {
        men: { time: '14:09:28', athlete: 'Jim Walmsley (USA)', date: '2019' },
        women: { time: '15:29:33', athlete: 'Courtney Dauwalter (USA)', date: '2023' }
    };

    const utmbData = {
        men: { time: '19:37:43', athlete: 'Jim Walmsley (USA)', date: '2023' },
        women: { time: '22:09:31', athlete: 'Katie Schide (USA)', date: '2024' }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-6xl space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <PageHeader
                        title="Athletics World Records"
                        description="The pinnacle of human endurance and speed."
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
                        {/* Sprint & Middle Distance */}
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Sprints & Middle Distance</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <RecordCard title="100m Sprint" data={hundredMData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="200m Sprint" data={twoHundredMData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="400m Run" data={fourHundredMData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="800m Run" data={eightHundredMData[gender]} icon={<Timer className="w-5 h-5" />} />
                            </div>
                        </section>

                        {/* Long Distance */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-t pt-10">
                                <Trophy className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Long Distance (Track)</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <RecordCard title="1500m Run" data={fifteenHundredMData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="The Mile" data={mileData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="5000m" data={fiveKData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="10,000m" data={tenKData[gender]} icon={<Timer className="w-5 h-5" />} />
                            </div>
                        </section>

                        {/* Road Racing */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-t pt-10">
                                <MapPin className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Road Racing</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                                <RecordCard title="Half Marathon" data={halfMarathonData[gender]} icon={<Timer className="w-5 h-5" />} />
                                <RecordCard title="Marathon" data={marathonData[gender]} icon={<Timer className="w-5 h-5" />} />
                            </div>
                        </section>

                        {/* Ultra-Marathons */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-t pt-10">
                                <Footprints className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold tracking-tight">Ultra Running & Iconic Trails</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <RecordCard title="50km Road" data={fiftyKData[gender]} icon={<Footprints className="w-5 h-5" />} />
                                <RecordCard title="100km Road" data={hundredKData[gender]} icon={<Footprints className="w-5 h-5" />} />
                                <RecordCard title="Western States 100" data={wserData[gender]} icon={<Footprints className="w-5 h-5" />} />
                                <RecordCard title="UTMB" data={utmbData[gender]} icon={<Footprints className="w-5 h-5" />} />
                            </div>
                        </section>

                        {/* Indoor Track & Field (Optional/Extra) */}
                        <section>
                            <div className="flex items-center gap-2 mb-6 border-t pt-10">
                                <Trophy className="w-6 h-6 text-primary italic" />
                                <h2 className="text-2xl font-bold tracking-tight">Indoor Track & Field Highlights</h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <RecordCard title="5000m (Short Track)" data={fiveKIndoorData[gender]} icon={<Timer className="w-5 h-5" />} />
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <PageFooter />
        </div>
    );
}

function RecordCard({ title, data, icon }: { title: string, data: any, icon: React.ReactNode }) {
    return (
        <div className="flex flex-col p-6 space-y-4 bg-card rounded-xl border border-border shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold tracking-tight text-lg">{title}</h3>
                <div className="text-muted-foreground bg-muted p-2 rounded-lg">{icon}</div>
            </div>
            <div>
                <div className="text-3xl font-black text-primary mb-1">{data.time}</div>
                <div className="font-medium text-foreground">{data.athlete}</div>
                <div className="text-sm text-muted-foreground mt-1">
                    {data.location && `${data.location} • `}{data.date}
                </div>
            </div>
        </div>
    );
}
