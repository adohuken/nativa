import type { Metadata } from "next";
import "./globals.css";
import { APP_CONFIG } from "@/lib/config";

export const metadata: Metadata = {
  title: `${APP_CONFIG.name.toUpperCase()} • Natural Language Acquisition Engine | SLA Pro`,
  description: "Plataforma de adquisición natural de segundas lenguas acelerada con la pedagogía de Stephen Krashen (Input Comprensible i+1, Filtro Afectivo Zen y Monitor Tardío).",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-[#07090e] text-neutral-100 font-sans">
        {children}
      </body>
    </html>
  );
}
