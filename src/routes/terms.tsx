import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer } from "@/components/SiteChrome";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Cyber Threat Daily Briefing" },
      { name: "description", content: "The terms governing your use of Cyber Threat Daily Briefing." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-invert">
        <h1>Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: [PLACEHOLDER — date]</p>

        <h2>Using the service</h2>
        <p>
          Cyber Threat Daily Briefing provides AI-rewritten summaries of publicly reported
          security news. By using the service you agree to these terms. The service is
          operated by [PLACEHOLDER — legal entity].
        </p>

        <h2>Your account</h2>
        <p>
          You are responsible for keeping your account credentials secure. You may delete
          your account at any time from Settings &rarr; Delete account.
        </p>

        <h2>Subscriptions and billing</h2>
        <p>
          Pro subscriptions are purchased and managed on our website. [PLACEHOLDER —
          describe pricing, renewal, and cancellation terms.]
        </p>

        <h2>Not professional advice</h2>
        <p>
          Our briefings are for general informational purposes only and are not a
          substitute for professional security, legal, or compliance advice. Always verify
          critical details against the original source we link.
        </p>

        <h2>Limitation of liability</h2>
        <p>[PLACEHOLDER — limitation of liability language, to be reviewed by counsel.]</p>

        <h2>Changes to these terms</h2>
        <p>We may update these terms and will revise the "Last updated" date above.</p>

        <h2>Contact</h2>
        <p>Questions? Contact us at [PLACEHOLDER — contact email].</p>
      </main>
      <Footer />
    </div>
  );
}
