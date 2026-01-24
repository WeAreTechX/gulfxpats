import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jingu - Find Your Dream Job",
  description: "Discover amazing job opportunities with top companies. Search, filter, and apply to jobs that match your skills and interests.",
  keywords: "jobs, careers, employment, job search, companies, hiring",
  authors: [{ name: "Jingu Team" }],
  openGraph: {
    title: "Jingu - Find Your Dream Job",
    description: "Discover amazing job opportunities with top companies.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jingu - Find Your Dream Job",
    description: "Discover amazing job opportunities with top companies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
