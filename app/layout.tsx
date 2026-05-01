import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import Footer from "@/components/Footer";
import TopBar from "@/components/TopBar";
import { getAllTags } from "@/lib/content";
import { Suspense } from "react";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Margen de Error",
  description: "Plataforma de periodismo científico sobre la construcción de la evidencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const tags = getAllTags();

  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-accent selection:text-white`}>
        <Suspense fallback={<div className="h-16 border-b border-border bg-background" />}>
          <TopBar tags={tags} />
        </Suspense>
        
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-12 md:py-24">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
