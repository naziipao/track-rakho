import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Track Rakho',
  description: 'My Personal Academic Planner',
  icons: {
    icon: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f7f6f2] text-stone-900 dark:bg-[#090a0f] dark:text-zinc-100 relative min-h-screen overflow-x-hidden`}
      >
        {/* Ambient Studio Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <div className="absolute -top-36 -left-24 w-[480px] h-[480px] rounded-full bg-teal-400/15 dark:bg-teal-500/[0.11] blur-[120px]" />
          <div className="absolute top-1/4 -right-32 w-[420px] h-[420px] rounded-full bg-amber-300/15 dark:bg-amber-500/[0.07] blur-[130px]" />
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}