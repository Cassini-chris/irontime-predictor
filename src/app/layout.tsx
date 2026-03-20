import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { FaviconSwitcher } from '@/components/favicon-switcher';
import { Navigation } from '@/components/navigation';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'IronTime Predictor',
  description: 'Futuristic calculator for your Ironman total time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          themes={['light', 'dark', 'theme-roth']}
        >
          <FaviconSwitcher />
          <Navigation />
          {children}
          <Toaster />
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3842615578259450"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
