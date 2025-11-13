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
    const finalUrl =
        url ?? (typeof lotId === "number" ? route("lots.favorite.toggle", lotId) : "");
    const { liked, count, busy, toggle } = useToggleFavourite({
        url: finalUrl,
        initialLiked,
        initialCount,
    });

    const sizeClasses =
        size === "sm"
            ? "h-7 px-2 text-[11px]"
            : size === "lg"
                ? "h-10 px-4 text-sm"
                : "h-8 px-3 text-xs";

    const iconSizeClasses =
        size === "sm"
            ? "h-3.5 w-3.5"
            : size === "lg"
                ? "h-4.5 w-4.5"
                : "h-4 w-4";

    const borderColor = liked ? "border-red-500" : "border-black";
    const contentColor = liked ? "text-red-600" : "text-black";

    return (
        <div className={cn("inline-flex items-center", className)}>
            <button
                type="button"
                onClick={toggle}
                disabled={!finalUrl || busy}
                aria-pressed={liked}
                aria-label={ariaLabel ?? (liked ? "Remove from favourites" : "Add to favourites")}
                className={cn(
                    "inline-flex items-center justify-center rounded-full transition-all",
                    "bg-background/70 backdrop-blur hover:bg-background/90 hover:shadow disabled:opacity-60",
                    sizeClasses,
                    borderColor
                )}
            >
                <Heart
                    className={cn(iconSizeClasses, contentColor)}
                    color="currentColor"
                    fill={liked ? "currentColor" : "none"}
                />
                {showCount && (
                    <span
                        className={cn(
                            "ml-2 font-medium tabular-nums",
                            contentColor
                        )}
                    >
                        {count}
                    </span>
                )}
            </button>
        </div>
    );
}
