import { createFileRoute } from "@tanstack/react-router";
import { Header, Footer } from "@/components/SiteChrome";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Cyber Threat Daily Briefing" },
      { name: "description", content: "How Cyber Threat Daily Briefing collects, uses, and protects your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-12 prose prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: [PLACEHOLDER — date]</p>

        <h2>Who we are</h2>
        <p>
          Cyber Threat Daily Briefing ("we", "us") is operated by [PLACEHOLDER — legal
          entity]. If you have questions about this policy, contact us at
          [PLACEHOLDER — contact email].
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>Account information: your email and name, provided when you sign up with email/password or Google sign-in.</li>
          <li>Usage data: briefings you save and your industry and topic preferences.</li>
        </ul>

        <h2>How we use it</h2>
        <p>
          We use your information to sign you in, personalize your briefing feed, and —
          if you enable it — send the weekly recap email. We do not sell your personal data.
        </p>

        <h2>Third-party services</h2>
        <p>
          We rely on service providers for hosting, authentication, and (on the web)
          payment processing. [PLACEHOLDER — list providers, e.g. Supabase, Stripe.]
        </p>

        <h2>Your rights</h2>
        <p>
          You can delete your account and all associated data at any time from
          Settings &rarr; Delete account.
        </p>

        <h2>Changes to this policy</h2>
        <p>We will post any updates to this page and revise the "Last updated" date above.</p>
      </main>
      <Footer />
    </div>
  );
}
