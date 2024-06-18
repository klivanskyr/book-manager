import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Header from "./Header";
import { ParentProvider } from "./utils/ContextWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Book Manager",
  description: "Rate and Review Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <ParentProvider>
          {children}
        </ParentProvider>
      </body>
    </html>
  );
}
