import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ["400", "500"] 
});

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-serif",
  weight: ["400", "700"] 
});

export const metadata: Metadata = {
  title: "Margen de Error | Periodismo Científico",
  description: "Explorando la construcción y distorsión de la ciencia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
