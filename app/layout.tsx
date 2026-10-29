import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { AuroraBackground } from '@/components/AuroraBackground';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'CloudMentor — AI Cloud Learning, Discovery & Cost Optimizer',
  description:
    'Comprehensive AI-powered cloud computing platform: AI tutor, free course academy, multi-cloud cost optimizer, provider explorer, future tech intelligence, and personalized roadmaps.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2317D6C5"><path d="M12 2v4M12 18v4M2 12h4M18 12h4m-7.07-7.07 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="%2338BDF8" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="%2317D6C5"/></svg>',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F7F9FF' },
    { media: '(prefers-color-scheme: dark)', color: '#080B18' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceSerif.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('cloudmentor_theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (stored === 'dark' || (!stored && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-light-bg dark:bg-dark-bg text-light-primary dark:text-dark-primary selection:bg-aurora-cyan/20 selection:text-aurora-cyan min-h-screen relative overflow-x-hidden">
        <AuroraBackground />
        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
