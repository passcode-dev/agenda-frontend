import { League_Spartan } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/layout/sidebar";

const league = League_Spartan({
  subsets: ["latin"],
})

export const metadata = {
  title: "AulaFácil",
  description: "AulaFácil é uma plataforma de agendameto de aulas online",
};

export default function RootLayout({ children }) {
  return (
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
  );
}
