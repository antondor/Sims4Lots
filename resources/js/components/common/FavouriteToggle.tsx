import * as React from "react";
import { Heart } from "lucide-react";
import { route } from "ziggy-js";
import { cn } from "@/lib/utils";
import { useToggleFavourite } from "@/hooks/use-toggle-favourite";

type Props = {
    lotId: number;
    initialLiked: boolean;
    initialCount?: number;
    showCount?: boolean;
    className?: string;
    size?: "sm" | "md";
};

export function FavouriteToggle({
                                    lotId,
                                    initialLiked,
                                    initialCount = 0,
                                    showCount = true,
                                    className,
                                    size = "md",
                                }: Props) {
    const favUrl = route("lots.favorite.toggle", lotId);
    const { liked, busy, count, toggle } = useToggleFavourite(initialLiked, favUrl, initialCount);

    const btnSize = size === "sm" ? "h-7 w-7" : "h-8 w-8";
    const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4";
    const pillCls =
        size === "sm"
            ? "px-1.5 py-0.5 text-[11px] min-w-[2ch]"
            : "px-2 py-0.5 text-xs min-w-[2ch]";

    return (
        <div className={cn("pointer-events-auto inline-flex items-center gap-2", className)}>
            <button
                type="button"
                onClick={toggle}
                disabled={busy}
                aria-pressed={liked}
                className={cn(
                    "inline-flex items-center justify-center rounded-full border bg-background/70 backdrop-blur border-border transition-all duration-150 hover:bg-background/90 hover:shadow disabled:opacity-60",
                    liked ? "text-red-600" : "text-foreground/70",
                    btnSize
                )}
                title={liked ? "Remove from favourites" : "Add to favourites"}
            >
                <Heart className={iconSize} fill={liked ? "currentColor" : "none"} />
            </button>
            {showCount && (
                <span className={cn("inline-flex justify-center rounded-full bg-background/70 backdrop-blur ring-1 ring-border", pillCls)}>
          {count}
        </span>
            )}
        </div>
    );
}
