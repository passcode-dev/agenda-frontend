"use client";
import { League_Spartan } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "./context/userContext";

const league = League_Spartan({
  subsets: ["latin"],
})

export default function RootLayout({ children }) {
  return (
    <UserProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            league.className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </UserProvider>
  );
}
