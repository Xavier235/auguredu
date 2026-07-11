import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PLANS, PlanId } from "@/lib/payments-config";

/**
 * Subscribes to the signed-in user's payment_requests and toasts
 * when a submission moves from pending → approved/rejected.
 * Renders nothing.
 */
export function PaymentNotifier() {
  const { user } = useAuth();
  const seen = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    // Seed with current statuses so we don't re-toast historical rows
    supabase
      .from("payment_requests")
      .select("id,status")
      .eq("user_id", user.id)
      .then(({ data }) => {
        for (const r of (data as any[]) ?? []) seen.current[r.id] = r.status;
      });

    const channel = supabase
      .channel(`pay-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payment_requests",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as any;
          const prev = seen.current[row.id];
          seen.current[row.id] = row.status;
          if (prev === row.status) return;
          const planName = PLANS[row.plan as PlanId]?.name ?? row.plan;
          if (row.status === "approved") {
            toast.success(`🎉 ${planName} approved — premium unlocked!`, {
              description: row.admin_notes || "Refresh to see your new features.",
              duration: 8000,
            });
          } else if (row.status === "rejected") {
            toast.error(`${planName} receipt was rejected`, {
              description: row.admin_notes || "Check the Upgrade page for details.",
              duration: 8000,
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return null;
}
