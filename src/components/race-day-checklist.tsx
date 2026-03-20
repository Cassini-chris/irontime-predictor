'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ClipboardCheck, RotateCcw, EyeOff, Eye, Trophy, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Sport = 'triathlon' | 'run';
type ChecklistCategory = 'pre' | 'swim' | 't1' | 'bike' | 't2' | 'run' | 'post' | 'gear' | 'nutrition';

type ChecklistItem = {
    id: string;
    label: string;
    checked: boolean;
    excluded: boolean;
};

type ChecklistData = Record<ChecklistCategory, ChecklistItem[]>;

const TRIATHLON_DATA: Partial<ChecklistData> = {
    pre: [
        { id: 'tri-pre-1', label: 'Timing Chip', checked: false, excluded: false },
        { id: 'tri-pre-2', label: 'Heart Rate Monitor / Watch', checked: false, excluded: false },
        { id: 'tri-pre-3', label: 'Sunscreen & Anti-chafe', checked: false, excluded: false },
        { id: 'tri-pre-4', label: 'Race License / ID', checked: false, excluded: false },
        { id: 'tri-pre-5', label: 'Safety Pins / Race Belt', checked: false, excluded: false },
        { id: 'tri-pre-6', label: 'Morning Nutrition/Coffee', checked: false, excluded: false },
    ],
    swim: [
        { id: 'tri-swim-1', label: 'Wetsuit / Swimskin', checked: false, excluded: false },
        { id: 'tri-swim-2', label: 'Goggles (2 pairs: Clear/Tinted)', checked: false, excluded: false },
        { id: 'tri-swim-3', label: 'Swim Cap (Official + Spare)', checked: false, excluded: false },
        { id: 'tri-swim-4', label: 'Trisuit', checked: false, excluded: false },
        { id: 'tri-swim-5', label: 'Ear Plugs / Nose Clip', checked: false, excluded: false },
    ],
    t1: [
        { id: 'tri-t1-1', label: 'Small Towel', checked: false, excluded: false },
        { id: 'tri-t1-2', label: 'Bike Shoes', checked: false, excluded: false },
        { id: 'tri-t1-3', label: 'Helmet', checked: false, excluded: false },
        { id: 'tri-t1-4', label: 'Sunglasses', checked: false, excluded: false },
        { id: 'tri-t1-5', label: 'Socks', checked: false, excluded: false },
    ],
    bike: [
        { id: 'tri-bike-1', label: 'Bike (Pumped & Checked)', checked: false, excluded: false },
        { id: 'tri-bike-2', label: 'Water Bottles (x2)', checked: false, excluded: false },
        { id: 'tri-bike-3', label: 'Nutrition (Gels/Bars/Chews)', checked: false, excluded: false },
        { id: 'tri-bike-4', label: 'Repair Kit (Tube/CO2/Levers)', checked: false, excluded: false },
        { id: 'tri-bike-5', label: 'Bike Computer', checked: false, excluded: false },
    ],
    t2: [
        { id: 'tri-t2-1', label: 'Running Shoes (Elastic Laces)', checked: false, excluded: false },
        { id: 'tri-t2-2', label: 'Hat / Visor', checked: false, excluded: false },
        { id: 'tri-t2-3', label: 'Talcum Powder', checked: false, excluded: false },
    ],
    run: [
        { id: 'tri-run-1', label: 'Race Belt (attached)', checked: false, excluded: false },
        { id: 'tri-run-2', label: 'Handheld Bottle / Flask', checked: false, excluded: false },
        { id: 'tri-run-3', label: 'Salt Tablets', checked: false, excluded: false },
    ],
    post: [
        { id: 'tri-post-1', label: 'Warm Transition Clothes', checked: false, excluded: false },
        { id: 'tri-post-2', label: 'Recovery Shake / Bar', checked: false, excluded: false },
        { id: 'tri-post-3', label: 'Comfy Shoes / Sandals', checked: false, excluded: false },
    ],
};

const RUN_DATA: Partial<ChecklistData> = {
    pre: [
        { id: 'run-pre-1', label: 'Race Bib & Safety Pins', checked: false, excluded: false },
        { id: 'run-pre-2', label: 'Timing Chip (if separate)', checked: false, excluded: false },
        { id: 'run-pre-3', label: 'GPS Watch (Charged)', checked: false, excluded: false },
        { id: 'run-pre-4', label: 'Heart Rate Strap', checked: false, excluded: false },
        { id: 'run-pre-5', label: 'Anti-chafe / Vaseline', checked: false, excluded: false },
    ],
    gear: [
        { id: 'run-gear-1', label: 'Racing Shoes', checked: false, excluded: false },
        { id: 'run-gear-2', label: 'Technical Socks', checked: false, excluded: false },
        { id: 'run-gear-3', label: 'Singlet / T-shirt', checked: false, excluded: false },
        { id: 'run-gear-4', label: 'Shorts / Tights', checked: false, excluded: false },
        { id: 'run-gear-5', label: 'Hat / Visor / Headband', checked: false, excluded: false },
        { id: 'run-gear-6', label: 'Sunglasses', checked: false, excluded: false },
    ],
    nutrition: [
        { id: 'run-nut-1', label: 'Gels / Energy Food', checked: false, excluded: false },
        { id: 'run-nut-2', label: 'Electrolyte Tablets', checked: false, excluded: false },
        { id: 'run-nut-3', label: 'Pre-race Breakfast', checked: false, excluded: false },
        { id: 'run-nut-4', label: 'Hydration Belt / Flask', checked: false, excluded: false },
    ],
    post: [
        { id: 'run-post-1', label: 'Warm Hoodie / Jacket', checked: false, excluded: false },
        { id: 'run-post-2', label: 'Compression Socks', checked: false, excluded: false },
        { id: 'run-post-3', label: 'Dry Shoes & Socks', checked: false, excluded: false },
        { id: 'run-post-4', label: 'Post-race Bag (Checked in)', checked: false, excluded: false },
    ],
};

const CATEGORIES: Record<Sport, { id: ChecklistCategory; label: string }[]> = {
    triathlon: [
        { id: 'pre', label: 'Pre-Race' },
        { id: 'swim', label: 'Swim' },
        { id: 't1', label: 'T1' },
        { id: 'bike', label: 'Bike' },
        { id: 't2', label: 'T2' },
        { id: 'run', label: 'Run' },
        { id: 'post', label: 'Post-Race' },
    ],
    run: [
        { id: 'pre', label: 'Pre-Race' },
        { id: 'gear', label: 'Gear' },
        { id: 'nutrition', label: 'Fuel' },
        { id: 'post', label: 'Recovery' },
    ],
};

export function RaceDayChecklist() {
    const [sport, setSport] = useState<Sport>('triathlon');
    const [triData, setTriData] = useState<Partial<ChecklistData>>(TRIATHLON_DATA);
    const [runData, setRunData] = useState<Partial<ChecklistData>>(RUN_DATA);
    const [isLoaded, setIsLoaded] = useState(false);

    const currentData = sport === 'triathlon' ? triData : runData;
    const setData = sport === 'triathlon' ? setTriData : setRunData;

    // Load from local storage
    useEffect(() => {
        const savedTri = localStorage.getItem('race-day-checklist-tri');
        const savedRun = localStorage.getItem('race-day-checklist-run');
        const savedSport = localStorage.getItem('race-day-checklist-sport') as Sport;

        if (savedTri) setTriData(JSON.parse(savedTri));
        if (savedRun) setRunData(JSON.parse(savedRun));
        if (savedSport) setSport(savedSport);

        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('race-day-checklist-tri', JSON.stringify(triData));
            localStorage.setItem('race-day-checklist-run', JSON.stringify(runData));
            localStorage.setItem('race-day-checklist-sport', sport);
        }
    }, [triData, runData, sport, isLoaded]);

    const toggleItem = (category: ChecklistCategory, id: string) => {
        setData((prev) => ({
            ...prev,
            [category]: prev[category]?.map((item: ChecklistItem) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            ),
        }));
    };

    const toggleExclude = (category: ChecklistCategory, id: string) => {
        setData((prev) => ({
            ...prev,
            [category]: prev[category]?.map((item: ChecklistItem) =>
                item.id === id ? { ...item, excluded: !item.excluded, checked: item.excluded ? item.checked : false } : item
            ),
        }));
    };

    const resetChecklist = () => {
        if (confirm(`Are you sure you want to reset the ${sport} checklist?`)) {
            setData(sport === 'triathlon' ? TRIATHLON_DATA : RUN_DATA);
        }
    };

    // Calculate progress (excluding "excluded" items)
    const stats = useMemo(() => {
        const allItems = Object.values(currentData).flat() as ChecklistItem[];
        const activeItems = allItems.filter(i => !i.excluded);
        const checkedItems = activeItems.filter(i => i.checked);

        const total = activeItems.length;
        const checked = checkedItems.length;
        const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

        return { total, checked, progress };
    }, [currentData]);

    return (
        <Card className="shadow-2xl border-primary/20 bg-card/80 backdrop-blur-xl">
            <CardHeader className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-headline tracking-tight flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <ClipboardCheck className="text-primary h-8 w-8" />
                            </div>
                            Race Day Checklist
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {stats.progress}% Ready. {stats.checked}/{stats.total} items packed.
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl w-fit">
                        <Button
                            variant={sport === 'triathlon' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSport('triathlon')}
                            className="rounded-lg gap-2"
                        >
                            <Trophy className="h-4 w-4" />
                            Triathlon
                        </Button>
                        <Button
                            variant={sport === 'run' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setSport('run')}
                            className="rounded-lg gap-2"
                        >
                            <Footprints className="h-4 w-4" />
                            Run
                        </Button>
                        <div className="w-[1px] h-6 bg-border mx-1" />
                        <Button variant="ghost" size="icon" onClick={resetChecklist} title="Reset Checklist" className="rounded-lg h-9 w-9">
                            <RotateCcw className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Progress value={stats.progress} className="h-3 grow" />
                    <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
                        <span>Preparation</span>
                        <span>{stats.progress === 100 ? 'Race Ready!' : 'In Progress'}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={CATEGORIES[sport][0].id} className="w-full">
                    <TabsList className="flex flex-wrap h-auto p-1 bg-muted/30 mb-8 gap-1">
                        {CATEGORIES[sport].map((cat) => (
                            <TabsTrigger
                                key={cat.id}
                                value={cat.id}
                                className="flex-1 min-w-[80px] py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg transition-all"
                            >
                                {cat.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="min-h-[400px]">
                        {CATEGORIES[sport].map((cat) => (
                            <TabsContent key={cat.id} value={cat.id} className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                                <div className="grid gap-3">
                                    {currentData[cat.id]?.map((item: ChecklistItem) => (
                                        <div
                                            key={item.id}
                                            className={cn(
                                                "group flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                                                item.excluded ? "opacity-40 border-dashed bg-muted/20" : "bg-card hover:border-primary/50 hover:shadow-md",
                                                item.checked && !item.excluded ? "border-primary/30 bg-primary/5" : ""
                                            )}
                                        >
                                            <div className="flex items-center space-x-4 flex-grow">
                                                <Checkbox
                                                    id={item.id}
                                                    checked={item.checked}
                                                    disabled={item.excluded}
                                                    onCheckedChange={() => toggleItem(cat.id, item.id)}
                                                    className="h-5 w-5 rounded-md"
                                                />
                                                <Label
                                                    htmlFor={item.id}
                                                    className={cn(
                                                        "text-base font-medium cursor-pointer transition-all",
                                                        item.checked && !item.excluded ? "line-through text-muted-foreground" : "text-foreground",
                                                        item.excluded ? "italic" : ""
                                                    )}
                                                >
                                                    {item.label}
                                                </Label>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleExclude(cat.id, item.id)}
                                                title={item.excluded ? "Include item" : "Exclude from list"}
                                                className={cn(
                                                    "h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity",
                                                    item.excluded ? "opacity-100 text-primary" : "text-muted-foreground"
                                                )}
                                            >
                                                {item.excluded ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}

