import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";


// Configure the Inter font with desired subsets and weights
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: "Persa",
  description: "The self help productivity web app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in" appearance={{  //default / was updated to /sign-in
      variables: { colorPrimary: '#001e3a' }
    }}>
      <html lang="en">
        <body className={cn("font-inter antialiased", inter.variable)}>
        
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}


//afterSignOutUrl="/" this was added by me by looking latest update of clerk by gpt web search