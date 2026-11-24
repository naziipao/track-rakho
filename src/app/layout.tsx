import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Track Rakho',
  description: 'Personal Academic Planner',
  icons: {
      apple: [{ url: '/logo.png?v=2', sizes: '180x180', type: 'image/png' }],
    },
  appleWebApp: {
    capable: true,
    title: 'Track Rakho',
    statusBarStyle: 'default',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}