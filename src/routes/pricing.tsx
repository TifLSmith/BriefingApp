import { createFileRoute } from "@tanstack/react-router";
import { PricingCards } from "@/components/PricingCards";
import { Header, Footer } from "@/components/SiteChrome";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Cyber Threat Daily Briefing" },
      { name: "description", content: "Free forever, or go Pro for real-time briefings, industry feeds, and weekly recaps." },
      { property: "og:title", content: "Pricing — Cyber Threat Daily Briefing" },
      { property: "og:description", content: "Pro: $9/mo or $86/year. Free: 3 stories per day." },
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Simple, honest pricing</h1>
          <p className="text-muted-foreground">Start free. Upgrade when you want real-time alerts.</p>
        </div>

        <PricingCards />

        <div className="mt-12 max-w-2xl mx-auto text-sm text-muted-foreground text-center">
          Pro plans are coming soon.
        </div>
      </main>
      <Footer />
    </div>
  );
}
