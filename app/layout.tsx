import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Scanova Diagnostics - NABL Accredited Lab | Home Collection Available',
  description: 'NABL-accredited diagnostic center offering comprehensive pathology, imaging, and home collection services. Free home sample collection above ₹500. Book your test today!',
  keywords: 'diagnostic center, pathology lab, medical imaging, home collection, NABL accredited, health packages, blood test, X-ray, CT scan, MRI',
  authors: [{ name: 'Scanova Diagnostics' }],
  openGraph: {
    title: 'Scanova Diagnostics - Trusted Healthcare Partner',
    description: 'Accurate diagnostics & care delivered to your door. NABL-accredited with 10+ years of excellence.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Navbar />
          <main className="pt-24">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}