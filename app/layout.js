import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Balance Sheet",
  description: "A simple balance sheet app.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} `} suppressHydrationWarning>
          <div className="flex min-h-screen">
            <Navigation />
            <main className="w-full min-h-screen bg-gray-100">
              <div className="container mx-auto">{children}</div>
            </main>
          </div>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
