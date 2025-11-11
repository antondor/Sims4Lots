import * as React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";
import { useToggleFavourite } from "@/hooks/use-toggle-favourite";

type Size = "sm" | "md" | "lg";

type Props = {
    lotId?: number;
    url?: string;
    initialLiked: boolean;
    initialCount?: number;
    showCount?: boolean;
    size?: Size;
    className?: string;
    ariaLabel?: string;
};

export function FavouriteToggle({
                                    lotId,
                                    url,
                                    initialLiked,
                                    initialCount = 0,
                                    showCount = false,
                                    size = "md",
                                    className,
                                    ariaLabel,
                                }: Props) {
    const finalUrl = url ?? (typeof lotId === "number" ? route("lots.favorite.toggle", lotId) : "");
    const { liked, count, busy, toggle } = useToggleFavourite({
        url: finalUrl,
        initialLiked,
        initialCount,
    });

    const dims =
        size === "sm" ? "h-7 w-7" :
            size === "lg" ? "h-10 w-10" :
                "h-8 w-8";

    return (
        <div className={cn("inline-flex items-center gap-2", className)}>
            <button
                type="button"
                onClick={toggle}
                disabled={!finalUrl || busy}
                aria-pressed={liked}
                aria-label={ariaLabel ?? (liked ? "Remove from favourites" : "Add to favourites")}
                className={cn(
                    "inline-flex items-center justify-center rounded-full border transition-all",
                    dims,
                    "bg-background/70 backdrop-blur hover:bg-background/90 hover:shadow disabled:opacity-60 border-border"
                )}
            >
                <Heart
                    className="h-4 w-4 text-red-600"
                    color="currentColor"
                    fill={liked ? "currentColor" : "none"}
                />
            </button>

            {showCount && (
                <span className="text-xs font-medium tabular-nums text-red-600">{count}</span>
            )}
        </div>
    );
}
