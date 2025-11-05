import * as React from "react";

type Props = { status: "pending" | "confirmed" | "invalid"; className?: string };

export function StatusBadge({ status, className }: Props) {
  const styles =
    status === "pending"
      ? "bg-amber-50/80 text-amber-700 border-amber-200"
      : status === "invalid"
      ? "bg-red-50/80 text-red-700 border-red-200"
      : "bg-emerald-50/80 text-emerald-700 border-emerald-200";

  return (
    <span className={["rounded-full px-2 py-1 text-[11px] font-medium backdrop-blur border", styles, className].filter(Boolean).join(" ")}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
