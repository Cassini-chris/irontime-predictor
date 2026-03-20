'use client';

import { RacePredictorCalculator } from '@/components/race-predictor-calculator';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function RacePredictorPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-6xl space-y-8">
                    <PageHeader
                        title="Race Predictor"
                        description="Predict finish times for different distances based on a recent race."
                    />

                    <RacePredictorCalculator />
                </div>
            </main>
            <PageFooter />
        </div>
    );
}
