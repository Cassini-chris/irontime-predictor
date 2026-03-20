'use client';

import { RunculatorCalculator } from '@/components/runculator-calculator';
import { SpeedConverter } from '@/components/speed-converter';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function RunculatorPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-6xl space-y-8">
                    <PageHeader
                        title="Runculator"
                        description="Calculate your running pace, distance, or duration"
                    />

                    <RunculatorCalculator />

                    <SpeedConverter />
                </div>
            </main>
            <PageFooter />
        </div>
    );
}
