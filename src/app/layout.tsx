import type { Metadata } from 'next';
import { Bebas_Neue, DM_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const bebasNeue = Bebas_Neue({
  weight:   ['400'],
  subsets:  ['latin'],
  variable: '--font-display',
  display:  'swap',
});

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
});

export const metadata: Metadata = {
  title:       { default: 'StreetFit', template: '%s | StreetFit' },
  description: 'Moda urbana com atitude. Regatas japonesas e roupas fitness.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1c1c1e',
              color:      '#f0f0f0',
              border:     '1px solid #333',
            },
            success: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
