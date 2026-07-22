import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sukabumi Eundeur — Digital Heavy Music Ecosystem",
  description: "Official Platform Heavy Music, Festival, Ticket War, Merchandise Store & Underground Culture Sukabumi (100% Self-Hosted VPS).",
  keywords: ["Sukabumi Eundeur", "Heavy Metal", "Underground Festival", "Music Ecosystem", "Tiket Konser"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
