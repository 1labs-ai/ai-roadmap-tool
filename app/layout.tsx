import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Product Roadmap Generator | 1Labs AI",
  description: "Generate a comprehensive 6-week AI product roadmap instantly. The same framework we use to take AI products from idea to live MVP. Free tool from 1Labs AI.",
  keywords: ["AI product", "MVP", "roadmap generator", "startup", "AI development", "product roadmap"],
  authors: [{ name: "1Labs AI", url: "https://1labs.ai" }],
  openGraph: {
    title: "AI Product Roadmap Generator | 1Labs AI",
    description: "Generate a comprehensive 6-week AI product roadmap instantly. Free tool from 1Labs AI.",
    url: "https://roadmap.1labs.app",
    siteName: "1Labs AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Product Roadmap Generator | 1Labs AI",
    description: "Generate a comprehensive 6-week AI product roadmap instantly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
