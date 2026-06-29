import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  industry: string | null;
  experience_level: string | null;
  topics: string[];
  onboarding_complete: boolean;
  email_digest_enabled: boolean;
};

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) {
      // Auto-create a row if trigger somehow missed
      const { data: created, error: insErr } = await supabase
        .from("profiles")
        .insert({ user_id: userId })
        .select("*")
        .single();
      if (insErr) throw new Error(insErr.message);
      return created as unknown as Profile;
    }
    return data as unknown as Profile;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    display_name?: string;
    role?: string;
    industry?: string;
    experience_level?: string;
    topics?: string[];
    email_digest_enabled?: boolean;
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    // Explicit allow-list with runtime type checks — never pass the raw client object
    // to .update() (prevents mass-assignment of columns like onboarding_complete).
    const updates: Record<string, unknown> = {};
    if (typeof data.display_name === "string") updates.display_name = data.display_name;
    if (typeof data.role === "string") updates.role = data.role;
    if (typeof data.industry === "string") updates.industry = data.industry;
    if (typeof data.experience_level === "string") updates.experience_level = data.experience_level;
    if (Array.isArray(data.topics)) updates.topics = data.topics.map(String);
    if (typeof data.email_digest_enabled === "boolean") updates.email_digest_enabled = data.email_digest_enabled;

    if (Object.keys(updates).length === 0) return { ok: true };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context;
    // supabaseAdmin (service role) is loaded dynamically for privileged ops only.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Remove the user's own rows first (service role bypasses RLS).
    for (const table of ["saved_briefings", "subscriptions", "profiles"] as const) {
      const { error } = await supabaseAdmin.from(table).delete().eq("user_id", userId);
      if (error) throw new Error(`Failed to delete ${table}: ${error.message}`);
    }

    // Finally remove the auth user itself.
    const { error: authErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authErr) throw new Error(`Failed to delete account: ${authErr.message}`);

    return { ok: true };
  });

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    role: string;
    industry: string;
    experience_level: string;
    topics: string[];
  }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({
        role: data.role,
        industry: data.industry,
        experience_level: data.experience_level,
        topics: data.topics,
        onboarding_complete: true,
      })
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
