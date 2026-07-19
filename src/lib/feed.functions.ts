import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Briefing } from "@/lib/briefings.functions";

export type FeedBriefing = Briefing & {
  category?: string;
  industry?: string;
  access_level?: string;
  if_one_thing?: string | null;
  saved?: boolean;
};

const SIX_HOURS = 6 * 60 * 60 * 1000;

function isProActive(sub: { status: string; current_period_end: string | null } | null) {
  if (!sub) return false;
  const end = sub.current_period_end ? new Date(sub.current_period_end).getTime() : Infinity;
  if (["active", "trialing", "past_due"].includes(sub.status)) return end > Date.now();
  if (sub.status === "canceled") return end > Date.now();
  return false;
}

async function userIsPro(userId: string, env: "sandbox" | "live"): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", userId)
    .eq("environment", env)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return isProActive(data as any);
}

export const getFeed = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: {
    environment: "sandbox" | "live";
    industry?: string;
    category?: string;
  }) => data)
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const pro = await userIsPro(userId, data.environment);

    let q = supabaseAdmin
      .from("briefing_cache")
      .select("*")
      .order("published_at", { ascending: false });

    if (data.industry && data.industry !== "all") q = q.or(`industry.eq.${data.industry},industry.eq.all`);
    if (data.category && data.category !== "all") q = q.eq("category", data.category);

    if (!pro) {
      const cutoff = new Date(Date.now() - SIX_HOURS).toISOString();
      q = q.lte("published_at", cutoff).limit(3);
    } else {
      q = q.limit(40);
    }

    const { data: rows } = await q;

    const { data: saved } = await supabaseAdmin
      .from("saved_briefings")
      .select("briefing_id")
      .eq("user_id", userId);
    const savedSet = new Set((saved ?? []).map((s) => s.briefing_id));

    return {
      pro,
      briefings: ((rows ?? []) as any[]).map((b) => ({ ...b, saved: savedSet.has(b.id) })) as FeedBriefing[],
    };
  });

export const getBriefingById = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; environment: "sandbox" | "live" }) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.id)) throw new Error("Invalid id");
    return data;
  })
  .handler(async ({ data, context }) => {
    const pro = await userIsPro(context.userId, data.environment);
    // Safe, non-Pro columns only — never pull Pro fields for content that may be locked.
    const TEASER_COLUMNS =
      "id, source_name, source_url, rewritten_title, rewritten_summary, severity, published_at, category, industry";

    const { data: teaser, error } = await supabaseAdmin
      .from("briefing_cache")
      .select(TEASER_COLUMNS)
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!teaser) throw new Error("Not found");

    const ageMs = Date.now() - new Date(teaser.published_at).getTime();
    const locked = !pro && ageMs < SIX_HOURS;

    // Only fetch the full Pro fields when the reader is actually entitled to them.
    let briefing: any = teaser;
    if (!locked) {
      const { data: fullRow, error: fullErr } = await supabaseAdmin
        .from("briefing_cache")
        .select("*")
        .eq("id", data.id)
        .maybeSingle();
      if (fullErr) throw new Error(fullErr.message);
      if (fullRow) briefing = fullRow;
    }

    const { data: savedRow } = await supabaseAdmin
      .from("saved_briefings")
      .select("id")
      .eq("user_id", context.userId)
      .eq("briefing_id", data.id)
      .maybeSingle();

    return { briefing: briefing as FeedBriefing, locked, pro, saved: !!savedRow };
  });

export type ToggleSaveResult = { ok: true } | { ok: false; reason: "pro_required" };

export const toggleSaveBriefing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; save: boolean }) => {
    if (!/^[0-9a-f-]{36}$/i.test(data.id)) throw new Error("Invalid id");
    return data;
  })
  .handler(async ({ data, context }): Promise<ToggleSaveResult> => {
    const { supabase, userId } = context;
    if (data.save) {
      const pro = await userIsPro(userId, "live");
      if (!pro) return { ok: false, reason: "pro_required" };

      const { error } = await supabase
        .from("saved_briefings")
        .insert({ user_id: userId, briefing_id: data.id });
      if (error && !error.message.toLowerCase().includes("duplicate")) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase
        .from("saved_briefings")
        .delete()
        .eq("user_id", userId)
        .eq("briefing_id", data.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const getSavedBriefings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("saved_briefings")
      .select("id, briefing_id, created_at, briefing_cache(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return {
      items: (data ?? []).map((row: any) => ({
        savedId: row.id,
        savedAt: row.created_at,
        briefing: row.briefing_cache as FeedBriefing,
      })),
    };
  });

export const getWeeklyRecaps = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: "sandbox" | "live" }) => data)
  .handler(async ({ data, context }) => {
    const pro = await userIsPro(context.userId, data.environment);
    if (!pro) return { pro, recaps: [] };
    const { data: rows, error } = await supabaseAdmin
      .from("weekly_recaps")
      .select("*")
      .order("week_start", { ascending: false })
      .limit(12);
    if (error) throw new Error(error.message);
    return { pro, recaps: rows ?? [] };
  });

export const getMySubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { environment: "sandbox" | "live" }) => data)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: row } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("environment", data.environment)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return { subscription: row, pro: isProActive(row as any) };
  });
