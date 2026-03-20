'use client';

import { Suspense } from 'react';
import { TrainingPaceCalculator } from '@/components/training-pace-calculator';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function TrainingPacesPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-6xl space-y-8">
                    <PageHeader
                        title="Training Paces"
                        description="Calculate your ideal training zones based on your recent race performance"
                    />

                    <Suspense fallback={<div className="text-center py-10">Loading calculator...</div>}>
                        <TrainingPaceCalculator />
                    </Suspense>
                </div>
            </main>
            <PageFooter />
        </div>
    );
}
