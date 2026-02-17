import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Product Roadmap Template | 1Labs AI",
  description: "The same framework we use to take AI products from idea to live MVP in 6 weeks. Free interactive template from 1Labs AI.",
  keywords: ["AI product", "MVP", "roadmap template", "startup", "AI development"],
  authors: [{ name: "1Labs AI", url: "https://1labs.ai" }],
  openGraph: {
    title: "AI Product Roadmap Template | 1Labs AI",
    description: "The same framework we use to take AI products from idea to live MVP in 6 weeks.",
    url: "https://roadmap.1labs.ai",
    siteName: "1Labs AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Product Roadmap Template | 1Labs AI",
    description: "The same framework we use to take AI products from idea to live MVP in 6 weeks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
