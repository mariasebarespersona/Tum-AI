import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tumai — AI Automation Platform",
  description: "Production-ready AI automations that compose like building blocks. From scraping to payments to AI agents — deploy in days, not months.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="marketing-layout">
      {children}
    </div>
  );
}
