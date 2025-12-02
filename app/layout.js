import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SpeedInsights } from "@vercel/speed-insights/next"
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://flixet.vercel.app'),
  title: 'Flixet - Watch Movies Free',
  description:
    'Stream movies and TV shows for free. No subscription required. Watch thousands of movies and series online.',
  keywords:
    'free movies, watch movies online, stream tv shows, free streaming, movies online',
  authors: [{ name: 'Flixet' }],
  creator: 'Flixet',
  publisher: 'Flixet',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://flixet.vercel.app',
    siteName: 'Flixet',
    title: 'Flixet - Watch Movies & TV Shows Free',
    description:
      'Stream thousands of movies and TV shows for free. No subscription required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flixet - Free Movie Streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flixet - Watch Movies Free',
    description:
      'Stream movies and TV shows for free. No subscription required.',
    images: ['/og-image.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#e50914',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ paddingBottom: 0 }}>
        <Header />
        <main
          className="container"
          style={{
            minHeight: '100vh',
            paddingTop: '40px',
            paddingBottom: '100px',
          }}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* font + meta links */}
      </head>
      <body style={{ paddingBottom: 0 }}>
        <Header />
        <main
          className="container"
          style={{
            minHeight: '100vh',
            paddingTop: '40px',
            paddingBottom: '100px',
          }}
        >
          {children}
        </main>
        <Footer />
        <SpeedInsights />   {/* <= here, in layout.js */}
      </body>
    </html>
  );
}
