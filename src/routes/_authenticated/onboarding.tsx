import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { completeOnboarding, getMyProfile } from "@/lib/profile.functions";
import { Shield, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Welcome — Set up your briefings" }] }),
  component: Onboarding,
});

const ROLES = ["Beginner / learning", "Career-switcher", "IT / engineer", "Business owner", "Executive / leadership", "Other"];
const INDUSTRIES = ["all", "healthcare", "finance", "retail", "tech", "education", "government", "other"];
const LEVELS = ["New to cybersecurity", "Some familiarity", "Working in the field"];
const TOPIC_OPTIONS = ["Ransomware", "Data breaches", "Phishing", "Cloud security", "Vulnerabilities (CVEs)", "Identity / passwords", "Mobile threats", "AI threats"];

function Onboarding() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getProfile = useServerFn(getMyProfile);
  const complete = useServerFn(completeOnboarding);

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });

  const [role, setRole] = useState(ROLES[0]);
  const [industry, setIndustry] = useState("all");
  const [experience, setExperience] = useState(LEVELS[0]);
  const [topics, setTopics] = useState<string[]>(["Ransomware", "Data breaches"]);

  const m = useMutation({
    mutationFn: () => complete({ data: { role, industry, experience_level: experience, topics } }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["profile"] });
      navigate({ to: "/briefing" });
    },
  });

  function toggleTopic(t: string) {
    setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  useEffect(() => {
    if (profile?.onboarding_complete) navigate({ to: "/briefing", replace: true });
  }, [profile, navigate]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-8">
        <div className="h-12 w-12 mx-auto rounded-xl bg-gradient-accent grid place-items-center shadow-glow mb-3">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-bold">Welcome to Cyber Threat Daily Briefing</h1>
        <p className="text-muted-foreground mt-2">A few quick questions so we can tailor your feed.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          m.mutate();
        }}
        className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-card"
      >
        <div className="space-y-2">
          <Label>What best describes you?</Label>
          <div className="grid sm:grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`text-left text-sm px-3 py-2 rounded-md border transition-colors ${role === r ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm"
          >
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i === "all" ? "All / not industry-specific" : i.charAt(0).toUpperCase() + i.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Experience level</Label>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setExperience(l)}
                className={`text-sm px-3 py-1.5 rounded-md border ${experience === l ? "border-primary bg-primary/10" : "border-border"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Topics you care about</Label>
          <div className="flex flex-wrap gap-2">
            {TOPIC_OPTIONS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => toggleTopic(t)}
                className={`text-sm px-3 py-1.5 rounded-md border ${topics.includes(t) ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {m.error && (
          <p className="text-sm text-destructive">{(m.error as Error).message}</p>
        )}

        <Button
          type="submit"
          disabled={m.isPending}
          className="w-full bg-gradient-accent text-primary-foreground shadow-glow"
        >
          {m.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Continue to my briefings
        </Button>
      </form>
    </div>
  );
}
