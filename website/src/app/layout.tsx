import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tumai — AI Automation Platform",
  description:
    "Production-ready AI automations that compose like building blocks. From scraping to payments to AI agents — deploy in days, not months.",
  openGraph: {
    title: "Tumai — AI Automation Platform",
    description:
      "Production-ready AI automations that compose like building blocks. Deploy in days, not months.",
    siteName: "Tumai",
    type: "website",
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
