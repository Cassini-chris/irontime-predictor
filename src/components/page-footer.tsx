'use client';

export function PageFooter() {
    return (
        <footer className="w-full py-8 text-center text-muted-foreground text-sm">
            <p>
                &copy; {new Date().getFullYear()} IronTime Predictor. Unleash your potential.
            </p>
        </footer>
    );
}
