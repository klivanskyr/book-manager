import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { ParentProvider } from "./utils/ContextWrapper";
import { NextUIProvider } from "@nextui-org/react";

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
      <body className='font-Urbanist'>
        <SpeedInsights />
        <NextUIProvider>
          <ParentProvider>
            {children}
          </ParentProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
