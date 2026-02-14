'use client';

import { useState, useEffect } from 'react';
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
import { ClipboardCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

type ChecklistCategory = 'pre' | 'swim' | 't1' | 'bike' | 't2' | 'run' | 'post';

type ChecklistItem = {
    id: string;
    label: string;
    checked: boolean;
};

type ChecklistData = Record<ChecklistCategory, ChecklistItem[]>;

const INITIAL_DATA: ChecklistData = {
    pre: [
        { id: 'pre-1', label: 'Timing Chip', checked: false },
        { id: 'pre-2', label: 'Heart Rate Monitor', checked: false },
        { id: 'pre-3', label: 'Sunscreen', checked: false },
        { id: 'pre-4', label: 'Body Glide/Lubricant', checked: false },
        { id: 'pre-5', label: 'Warm Clothes', checked: false },
        { id: 'pre-6', label: 'Breakfast/Coffee', checked: false },
        { id: 'pre-7', label: 'Hydration', checked: false },
    ],
    swim: [
        { id: 'swim-1', label: 'Wetsuit / Swimskin', checked: false },
        { id: 'swim-2', label: 'Goggles (Clear lens)', checked: false },
        { id: 'swim-3', label: 'Goggles (Tinted lens)', checked: false },
        { id: 'swim-4', label: 'Swim Cap (Official)', checked: false },
        { id: 'swim-5', label: 'Trisuit', checked: false },
        { id: 'swim-6', label: 'Ear Plugs', checked: false },
    ],
    t1: [
        { id: 't1-1', label: 'Small Towel', checked: false },
        { id: 't1-2', label: 'Bike Shoes (if not on bike)', checked: false },
        { id: 't1-3', label: 'Helmet', checked: false },
        { id: 't1-4', label: 'Sunglasses', checked: false },
        { id: 't1-5', label: 'Race Number Belt', checked: false },
        { id: 't1-6', label: 'Socks', checked: false },
    ],
    bike: [
        { id: 'bike-1', label: 'Bike (Check tire pressure)', checked: false },
        { id: 'bike-2', label: 'Water Bottles (Filled)', checked: false },
        { id: 'bike-3', label: 'Nutrition (Gels/Bars)', checked: false },
        { id: 'bike-4', label: 'Spare Tube / Repair Kit', checked: false },
        { id: 'bike-5', label: 'CO2 / Pump', checked: false },
        { id: 'bike-6', label: 'Bike Computer (Charged)', checked: false },
    ],
    t2: [
        { id: 't2-1', label: 'Running Shoes', checked: false },
        { id: 't2-2', label: 'Hat / Visor', checked: false },
        { id: 't2-3', label: 'Fresh Socks (optional)', checked: false },
        { id: 't2-4', label: 'More Nutrition', checked: false },
    ],
    run: [
        { id: 'run-1', label: 'Gels / Salt Tabs', checked: false },
        { id: 'run-2', label: 'Vaseline / Anti-chafe', checked: false },
        { id: 'run-3', label: 'Sunglasses', checked: false },
    ],
    post: [
        { id: 'post-1', label: 'Recovery Drink', checked: false },
        { id: 'post-2', label: 'Dry Clothes', checked: false },
        { id: 'post-3', label: 'Comfy Shoes / Sandals', checked: false },
        { id: 'post-4', label: 'Phone', checked: false },
    ],
};

export function RaceDayChecklist() {
    const [data, setData] = useState<ChecklistData>(INITIAL_DATA);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage
    useEffect(() => {
        const saved = localStorage.getItem('race-day-checklist');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse checklist data', e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('race-day-checklist', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const toggleItem = (category: ChecklistCategory, id: string) => {
        setData((prev) => ({
            ...prev,
            [category]: prev[category].map((item) =>
                item.id === id ? { ...item, checked: !item.checked } : item
            ),
        }));
    };

    const resetChecklist = () => {
        if (confirm('Are you sure you want to reset all checks?')) {
            setData(INITIAL_DATA);
        }
    };

    // Calculate progress
    const totalItems = Object.values(data).flat().length;
    const checkedItems = Object.values(data).flat().filter(i => i.checked).length;
    const progress = Math.round((checkedItems / totalItems) * 100);

    return (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-headline tracking-tight flex items-center gap-2">
                        <ClipboardCheck className="text-primary" />
                        Race Day Checklist
                    </CardTitle>
                    <CardDescription>
                        Don't forget the essentials. {progress}% Ready.
                    </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetChecklist} title="Reset Checklist">
                    <RotateCcw className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="pre" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-4 h-auto">
                        <TabsTrigger value="pre" className="text-xs px-1">Pre</TabsTrigger>
                        <TabsTrigger value="swim" className="text-xs px-1">Swim</TabsTrigger>
                        <TabsTrigger value="t1" className="text-xs px-1">T1</TabsTrigger>
                        <TabsTrigger value="bike" className="text-xs px-1">Bike</TabsTrigger>
                        <TabsTrigger value="t2" className="text-xs px-1">T2</TabsTrigger>
                        <TabsTrigger value="run" className="text-xs px-1">Run</TabsTrigger>
                        <TabsTrigger value="post" className="text-xs px-1">Post</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                        {Object.entries(data).map(([category, items]) => (
                            <TabsContent key={category} value={category} className="mt-0">
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={item.id}
                                                checked={item.checked}
                                                onCheckedChange={() => toggleItem(category as ChecklistCategory, item.id)}
                                            />
                                            <Label
                                                htmlFor={item.id}
                                                className={`text-sm cursor-pointer ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                                            >
                                                {item.label}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                        ))}
                    </ScrollArea>
                </Tabs>
            </CardContent>
        </Card>
    );
}
