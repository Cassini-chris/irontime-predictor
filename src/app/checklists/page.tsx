'use client';

import { RaceDayChecklist } from '@/components/race-day-checklist';
import { PageHeader } from '@/components/page-header';
import { PageFooter } from '@/components/page-footer';

export default function ChecklistsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
                <div className="w-full max-w-4xl space-y-12">
                    <PageHeader
                        title="Race Preparation"
                        description="Everything you need for your big day. Select your sport and start packing."
                    />

                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50" />
                        <RaceDayChecklist />
                    </div>

                    <section className="grid md:grid-cols-2 gap-8 pt-8">
                        <div className="p-6 rounded-2xl bg-card/50 border border-border space-y-3">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                💡 Pro Tip: The "Why"
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Mental bandwidth is a limited resource on race morning. By checking off every item
                                the night before, you free up your mind to focus solely on your pacing and nutrition strategy.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-card/50 border border-border space-y-3">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                🛡️ Preparation Shield
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Use the "Exclude" icon (the eye) for gear you aren't bringing (like a wetsuit in a
                                non-wetsuit legal swim). This keeps your progress bar accurate to *your* race.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
            <PageFooter />
        </div>
    );
}
