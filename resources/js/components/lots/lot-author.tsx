import * as React from "react";

export function LotAuthor({
                              name,
                              avatarUrl,
                          }: {
    name?: string | null;
    avatarUrl?: string | null;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border">
                <img
                    src={avatarUrl ?? "/images/profile_avatar_placeholder.png"}
                    alt={name ?? "User"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                />
            </div>
            <div className="min-w-0">
                <div className="truncate font-medium">{name ?? "Unknown"}</div>
            </div>
        </div>
    );
}
