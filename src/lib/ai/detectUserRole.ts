import { roleTriggers } from "@/lib/RoleTriggers";

export function detectUserRole(message: string): string {
  return (
    roleTriggers.find((r) =>
      r.phrases.some((p) => message.toLowerCase().includes(p))
    )?.role || "assistant"
  );
}
