import { createFileRoute, Outlet, redirect, useLocation, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile } from "@/lib/profile.functions";
import { Header, Footer } from "@/components/SiteChrome";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: AuthLayout,
});

function AuthLayout() {
  const fn = useServerFn(getMyProfile);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!profile) return;
    if (!profile.onboarding_complete && location.pathname !== "/onboarding") {
      navigate({ to: "/onboarding", replace: true });
    }
  }, [profile, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
