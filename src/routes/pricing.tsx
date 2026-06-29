import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PricingCards } from "@/components/PricingCards";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Header, Footer } from "@/components/SiteChrome";
import { useAuth } from "@/hooks/useAuth";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [priceId, setPriceId] = useState<"pro_monthly" | "pro_yearly">("pro_monthly");

  function onSubscribe(p: "pro_monthly" | "pro_yearly") {
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    setPriceId(p);
    setOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <PaymentTestModeBanner />
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">Simple, honest pricing</h1>
          <p className="text-muted-foreground">Start free. Upgrade when you want real-time alerts.</p>
        </div>

        <PricingCards onSubscribe={onSubscribe} />

        <div className="mt-12 max-w-2xl mx-auto text-sm text-muted-foreground text-center">
          Cancel anytime from your billing portal. Payments are processed securely by Stripe.
        </div>
      </main>
      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Subscribe to Pro</DialogTitle>
          </DialogHeader>
          {user && (
            <StripeEmbeddedCheckout
              priceId={priceId}
              customerEmail={user.email}
              userId={user.id}
              returnUrl={`${window.location.origin}/briefing?checkout=success`}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
