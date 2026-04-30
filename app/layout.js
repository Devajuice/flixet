import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import { WatchlistProvider } from "@/context/WatchlistContext";
import { ContinueWatchingProvider } from "@/context/ContinueWatchingContext";

export const metadata = {
  metadataBase: new URL("https://flixet.vercel.app"),
  title: "Flixet - Watch Movies, TV Shows and Anime Free",
  description:
    "Stream Movies, TV shows and Anime for free. No subscription required. Watch thousands of movies and series online.",
  keywords:
    "free movies, watch movies online, stream tv shows, free streaming, movies online, anime streaming",
  authors: [{ name: "Devajuice" }],
  creator: "Devajuice",
  publisher: "Devajuice",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://flixet.vercel.app",
    siteName: "Flixet",
    title: "Flixet - Watch Movies, TV Shows and Anime",
    description:
      "Stream thousands of Movies, TV shows and Anime for free. No subscription required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flixet - Free Movies, TV Shows and Anime",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flixet - Watch Movies, TV Shows & Anime",
    description:
      "Stream Movies, TV shows and Anime for free. No subscription required.",
    images: ["/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#e50914",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <WatchlistProvider>
          <ContinueWatchingProvider>
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <Header />
            <main
              id="main-content"
              style={{
                minHeight: "100vh",
                paddingTop: "var(--space-10)",
                paddingBottom: "var(--space-16)",
              }}
            >
              {children}
            </main>
            <Footer />
            <SpeedInsights />
            <Analytics />
          </ContinueWatchingProvider>
        </WatchlistProvider>
      </body>
    </html>
  );
}
