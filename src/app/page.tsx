import { IronTimePredictor } from '@/components/iron-time-predictor';
import { Logo } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
        <div className="w-full max-w-6xl space-y-8">
          <header className="text-center space-y-2 relative">
            <div className="absolute top-0 right-0">
              <ThemeToggle />
            </div>
            <div className="inline-flex items-center justify-center gap-2">
              <Logo className="h-10 w-10 text-primary" />
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-headline">
                IronTime Predictor
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A futuristic calculator for your Ironman total time. Input your
              discipline times to predict your finish.
            </p>
          </header>

          <IronTimePredictor />
        </div>
      </main>
      <footer className="w-full py-8 text-center text-muted-foreground text-sm">
        <p>
          &copy; {new Date().getFullYear()} IronTime Predictor. Unleash your
          potential.
        </p>
      </footer>
    </div>
  );
}
