import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/custom/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Jingu - Find Your Dream Job",
    template: "%s | Jingu",
  },
  description: "Discover amazing job opportunities with top companies. Search, filter, and apply to jobs that match your skills and interests.",
  keywords: ["jobs", "careers", "employment", "job search", "companies", "hiring"],
  authors: [{ name: "Jingu Team" }],
  openGraph: {
    title: "Jingu - Find Your Dream Job",
    description: "Discover amazing job opportunities with top companies.",
    type: "website",
    locale: "en_US",
    siteName: "Jingu",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jingu - Find Your Dream Job",
    description: "Discover amazing job opportunities with top companies.",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ToastProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
