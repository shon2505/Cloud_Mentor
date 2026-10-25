import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

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
  title: 'CloudMentor — Cloud Computing Study Assistant',
  description:
    'A specialized, domain-restricted AI study assistant for cloud computing students and engineers, covering AWS, Azure, GCP, Docker, Kubernetes, serverless, and cloud certifications.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23C96442"><path d="M12 2v4M12 18v4M2 12h4M18 12h4m-7.07-7.07 2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="%23C96442" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="3" fill="%23C96442"/></svg>',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F5' },
    { media: '(prefers-color-scheme: dark)', color: '#262624' },
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
      <body className="font-sans antialiased bg-[#FAF9F5] dark:bg-[#262624] text-[#1F1E1D] dark:text-[#F5F4EE] selection:bg-[#C96442]/20 selection:text-[#C96442]">
        {children}
      </body>
    </html>
  );
}
