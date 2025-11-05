import * as React from "react";

type Props = {
  src?: string | null;
  alt?: string;
  size?: number;
  fallback?: React.ReactNode;
  className?: string;
};

export function Avatar({ src, alt = "", size = 40, fallback, className }: Props) {
  return (
    <div
      className={["overflow-hidden rounded-full ring-1 ring-border", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        fallback ?? <div className="h-full w-full bg-muted" />
      )}
    </div>
  );
}
