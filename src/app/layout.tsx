import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import GlobalNavbar from "@/components/layout/GlobalNavbar";
import GlobalFooter from "@/components/layout/GlobalFooter";
import SmoothScroll from "@/components/layout/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["300", "400", "500", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sukabumieundeur.com"),
  title: "Sukabumi Eundeur — The Ultimate Heavy Music Ecosystem",
  description: "Experience the most immersive heavy music festival, culture, and digital ecosystem in Sukabumi, Indonesia.",
  keywords: ["Sukabumi Eundeur", "Heavy Metal", "Underground Festival", "Music Ecosystem", "Creative Economy"],
  openGraph: {
    title: "Sukabumi Eundeur — The Ultimate Heavy Music Ecosystem",
    description: "Experience the most immersive heavy music festival, culture, and digital ecosystem in Sukabumi, Indonesia.",
    url: "https://sukabumieundeur.com",
    siteName: "Sukabumi Eundeur",
    images: [
      {
        url: "/og-image.jpg", // placeholder, assuming there's an image
        width: 1200,
        height: 630,
        alt: "Sukabumi Eundeur",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`dark ${outfit.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-brand selection:text-black">
        <CustomCursor />
        <SmoothScroll>
          <NoiseOverlay />
          <GlobalNavbar />
          <main className="flex-1 flex flex-col w-full z-10 relative">
            {children}
          </main>
          <GlobalFooter />
        </SmoothScroll>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#000',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '0',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#000',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#000',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
