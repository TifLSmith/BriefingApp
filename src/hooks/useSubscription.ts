import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMySubscription } from "@/lib/feed.functions";

export function useSubscription(enabled = true) {
  const fn = useServerFn(getMySubscription);
  return useQuery({
    queryKey: ["subscription"],
    queryFn: () => fn({ data: { environment: "live" } }),
    enabled,
    staleTime: 30_000,
  });
}
