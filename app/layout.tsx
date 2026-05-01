import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import Header from "@/components/Header";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "Margen de Error",
  description: "Periodismo científico independiente. Cómo se construye y distorsiona la evidencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-accent selection:text-white`}>
        <Header />
        <main className="flex-1 w-full max-w-[2000px] mx-auto flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
