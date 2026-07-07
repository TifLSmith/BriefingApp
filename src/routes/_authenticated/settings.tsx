import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile, deleteMyAccount } from "@/lib/profile.functions";
import { useSubscription } from "@/hooks/useSubscription";
import { useIsNativeApp } from "@/lib/platform";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LogOut, Crown, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: Settings,
});

const INDUSTRIES = ["all", "healthcare", "finance", "retail", "tech", "education", "government", "other"];

function Settings() {
  const router = useRouter();
  const qc = useQueryClient();
  const getProfile = useServerFn(getMyProfile);
  const updateProfile = useServerFn(updateMyProfile);
  const del = useServerFn(deleteMyAccount);
  const native = useIsNativeApp();

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });
  const { data: sub } = useSubscription();

  const [displayName, setDisplayName] = useState("");
  const [industry, setIndustry] = useState("all");
  const [digest, setDigest] = useState(true);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name ?? "");
      setIndustry(profile.industry ?? "all");
      setDigest(profile.email_digest_enabled);
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: () => updateProfile({ data: { display_name: displayName, industry, email_digest_enabled: digest } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });

  const deleteAccount = useMutation({
    mutationFn: () => del(),
    onSuccess: async () => {
      await supabase.auth.signOut();
      router.navigate({ to: "/" });
    },
  });

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/" });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">Profile</h2>
        <div className="space-y-1.5">
          <Label htmlFor="dn">Display name</Label>
          <Input id="dn" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ind">Industry</Label>
          <select id="ind" value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-10 rounded-md border border-border bg-input px-3 text-sm">
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={digest} onChange={(e) => setDigest(e.target.checked)} />
          Email me the weekly digest
        </label>
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save profile
        </Button>
        {save.isSuccess && <p className="text-sm text-primary">Saved.</p>}
      </section>

      <section className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">Subscription {sub?.pro && <span className="text-xs bg-gradient-accent text-primary-foreground px-2 py-0.5 rounded font-mono uppercase">Pro</span>}</h2>
        {sub?.subscription ? (
          <div className="text-sm text-muted-foreground">
            <p>Status: <span className="text-foreground">{(sub.subscription as any).status}</span></p>
            {(sub.subscription as any).current_period_end && (
              <p>Renews / ends: <span className="text-foreground">{new Date((sub.subscription as any).current_period_end).toLocaleDateString()}</span></p>
            )}
            <p className="mt-3 text-muted-foreground">Subscription management is coming soon.</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-3">You're on the Free plan.</p>
            {native ? (
              <p className="text-sm text-muted-foreground">Manage your subscription on the web.</p>
            ) : (
              <Button onClick={() => router.navigate({ to: "/pricing" })} className="bg-gradient-accent text-primary-foreground shadow-glow">
                <Crown className="h-4 w-4 mr-1" /> Upgrade to Pro
              </Button>
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-destructive/40 bg-card p-6 space-y-3">
        <h2 className="font-semibold text-destructive">Delete account</h2>
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all your data. This cannot be undone.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-destructive/50 text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4 mr-1" /> Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This permanently deletes your profile, saved briefings, and subscription
                record, and signs you out. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteAccount.mutate()}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-1" /> Sign out
        </Button>
      </section>
    </div>
  );
}
