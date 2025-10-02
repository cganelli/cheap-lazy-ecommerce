import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SkipLink from "@/components/SkipLink";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cheap & Lazy Stuff - Great Deals on Everything You Need",
  description: "Find amazing deals on beauty, kitchen, electronics, dorm essentials, and more. Everything you need without the hassle - delivered fast!",
  keywords: "cheap deals, amazon products, beauty, kitchen, electronics, dorm essentials, pet care, household items",
  authors: [{ name: "Cheap & Lazy Stuff" }],
  creator: "cheapandlazystuff.com",
  publisher: "Cheap & Lazy Stuff",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Cheap & Lazy Stuff - Great Deals on Everything",
    description: "Find amazing deals on beauty, kitchen, electronics, and more!",
    url: "https://cheapandlazystuff.com",
    siteName: "Cheap & Lazy Stuff",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=4" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png?v=4" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png?v=4" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
