import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";
import Tweaks from "./components/Tweaks";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Barış Şev",
  description: "AI-Native Product Builder — Digital ürünleri AI-native yaklaşımla inşa ediyorum.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Cursor />
        {children}
        <Tweaks />
      </body>
    </html>
  );
}
