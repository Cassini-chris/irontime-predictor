import { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { TrainingPlansView } from '@/components/training-plans-view';

export const metadata: Metadata = {
    title: 'Training Plans | 5K to Ironman',
    description: 'Dynamic 8, 12, and 16-week training plans tailored to your goal time for 5K, 10K, Half Marathon, Marathon, 70.3, and Full Ironman.',
};

export default function TrainingPlansPage() {
    return (
        <main className="container max-w-7xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader 
                title="Training Plans" 
                description="Structured, research-backed training plans for your next race. Enter your goal time to dynamically adjust paces and download your plan."
            />
            <TrainingPlansView />
        </main>
    );
}
