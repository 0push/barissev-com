import type { Metadata } from "next";
import { Sora, Figtree } from "next/font/google";
import "./globals.css";
import Cursor from "./components/Cursor";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600", "800"],
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
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
    <html lang="tr" className={`${sora.variable} ${figtree.variable}`}>
      <body>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
