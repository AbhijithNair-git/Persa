import type { Metadata } from "next";
import { Inter } from 'next/font/google';
// import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";


// Configure the Inter font with desired subsets and weights
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap', // Ensures text remains visible during font loading
});



export const metadata: Metadata = {
  title: "Persa",
  description: "The self help productivity web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      afterSignOutUrl="/"
      appearance={{ variables: { colorPrimary: '#001e3a' } }}
    >
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="font-inter antialiased" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}


//afterSignOutUrl="/" this was added by me by looking latest update of clerk by gpt web search