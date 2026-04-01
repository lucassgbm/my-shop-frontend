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
            duration: 3500,
            style: {
              background:   '#1c1c1e',
              color:        '#f0f0f0',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              fontSize:     '14px',
              fontWeight:   '500',
              boxShadow:    '0 20px 40px rgba(0,0,0,0.6)',
              padding:      '12px 16px',
            },
            success: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
