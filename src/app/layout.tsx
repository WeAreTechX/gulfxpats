import type { Metadata } from "next";
import { Figtree} from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/custom/Toast";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: {
    default: "GulfXpats - Find Your Dream Job",
    template: "%s | GulfXpats",
  },
  description: "Discover amazing job opportunities with top companies. Search, filter, and apply to jobs that match your skills and interests.",
  keywords: ["jobs", "careers", "employment", "job search", "companies", "hiring"],
  authors: [{ name: "GulfXpats Team" }],
  openGraph: {
    title: "GulfXpats - Find Your Dream Job",
    description: "Discover amazing job opportunities with top companies.",
    type: "website",
    locale: "en_US",
    siteName: "GulfXpats",
  },
  twitter: {
    card: "summary_large_image",
    title: "GulfXpats - Find Your Dream Job",
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
      <body className={`${figtree.variable} font-sans antialiased`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
