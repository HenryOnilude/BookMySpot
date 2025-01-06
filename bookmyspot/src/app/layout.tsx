import "./globals.css";
import 'leaflet/dist/leaflet.css';
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/ui/loading";
import { Toaster } from "@/components/ui/toaster";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export const metadata: Metadata = {
  title: {
    default: "BookMySpot - Secure Parking Solutions",
    template: "%s | BookMySpot"
  },
  description: "Find and book parking spots easily with BookMySpot. Safe, secure, and convenient parking solutions.",
  keywords: ["parking", "book parking", "parking spot", "secure parking"],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const headersList = headers();
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          <ClientLayout>
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </ClientLayout>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}