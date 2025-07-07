// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Libreng Sakay QC',
  description: 'Free City Bus Service - Quezon City',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
