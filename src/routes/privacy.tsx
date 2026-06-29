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
        <p className="text-sm text-muted-foreground">Last updated: 6/28/26</p>

        <p>
          This Privacy Policy describes how TECHIE LIFE ("we", "us", or "our") collects,
          uses, and protects your information when you use the Cyber Threat Daily Briefing
          application and website (the "Service").
        </p>

        <h2>Information We Collect</h2>
        <p>We collect the following when you create an account and use the Service:</p>
        <ul>
          <li>
            <strong>Account information:</strong> your email address and authentication
            credentials. If you sign in with a third-party provider such as Google, we
            receive your email address and basic profile information from that provider.
          </li>
          <li>
            <strong>Profile preferences:</strong> the industry, experience level, and topic
            interests you select to personalize your briefings.
          </li>
          <li>
            <strong>Usage information:</strong> which briefings you view or save, and basic
            technical data such as device type and access times, used to operate and improve
            the Service.
          </li>
        </ul>
        <p>
          We do not collect or store payment card information. We do not knowingly collect
          information from anyone under the age of 13.
        </p>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>
            To provide, maintain, and personalize the Service, including delivering briefings
            relevant to your selected preferences.
          </li>
          <li>To authenticate your account and keep it secure.</li>
          <li>
            To communicate with you about the Service, including notifications you opt into.
          </li>
          <li>To monitor, analyze, and improve the Service.</li>
        </ul>

        <h2>How We Share Your Information</h2>
        <p>
          We do not sell your personal information. We share information only with service
          providers who help us operate the Service:
        </p>
        <ul>
          <li>
            Infrastructure and database providers that host the Service and store your
            account data.
          </li>
          <li>
            AI processing providers (such as Anthropic or OpenAI) that we use to summarize
            and rewrite publicly available security news into plain-language briefings. We do
            not send your personal account information to these providers as part of
            generating briefings.
          </li>
        </ul>
        <p>
          We may also disclose information if required by law, or to protect the rights,
          safety, or property of our users or the public.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your account information for as long as your account is active. When you
          delete your account, we permanently remove your account information and associated
          personal data from our systems, except where we are required to retain certain
          information by law.
        </p>

        <h2>Your Rights and Choices</h2>
        <ul>
          <li>
            <strong>Account deletion:</strong> You can permanently delete your account and
            associated personal data at any time from within the app's settings.
          </li>
          <li>
            <strong>Access and correction:</strong> You can review and update your profile
            information in your account settings.
          </li>
          <li>
            <strong>Communications:</strong> You can adjust your notification preferences at
            any time.
          </li>
        </ul>

        <h2>Security</h2>
        <p>
          We use industry-standard measures to protect your information, including access
          controls and encryption in transit. No method of transmission or storage is
          completely secure, but we work to protect your data and limit access to it.
        </p>

        <h2>International Users</h2>
        <p>
          If you access the Service from outside the country where our infrastructure is
          located, your information may be transferred to, stored, and processed in that
          country.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          "Last updated" date above. Continued use of the Service after changes take effect
          constitutes acceptance of the revised policy.
        </p>

        <h2>Contact Us</h2>
        <p>This Service is operated by TECHIE LIFE.</p>
      </main>
      <Footer />
    </div>
  );
}
