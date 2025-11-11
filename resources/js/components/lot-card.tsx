import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Lot } from "@/types/lots";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import {resolveSrc, AVATAR_PLACEHOLDER, IMAGE_PLACEHOLDER} from "@/lib";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";

type Props = { lot: Lot & { is_favorited?: boolean; isFavorited?: boolean } };

export function LotCard({ lot }: Props) {
    const userName = lot.user?.name ?? "Unknown user";
    const userAvatar = lot.user?.avatar_url ?? resolveSrc(lot.user?.avatar) ?? AVATAR_PLACEHOLDER;

    const lotId = (lot as any).id;
    const lotUrl = lotId ? route("lots.view", { lot: lotId }) : "#";
    const userUrl = lot.user?.id ? route("users.show", { user: lot.user.id }) : null;

    const cover = lot.cover_image ?? (lot.images?.[0] ?? null);
    const coverUrl = cover?.url ? (resolveSrc(cover.url) ?? IMAGE_PLACEHOLDER) : IMAGE_PLACEHOLDER;

    const isCommunity = lot.lot_type === "Community";
    const initialLiked = Boolean((lot as any).is_favorited ?? (lot as any).isFavorited);
    const initialCount = typeof lot.favorites_count === "number" ? lot.favorites_count : 0;

    return (
        <Card className="gap-2 py-4 group w-full max-w-full rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 overflow-hidden text-[15px] md:text-base">
                    {userUrl ? (
                        <Link href={userUrl} aria-label={`Open profile of ${userName}`}>
                            <img
                                src={userAvatar}
                                alt={userName}
                                className="h-10 w-10 rounded-full object-cover shrink-0 ring-1 ring-border hover:opacity-90 transition"
                            />
                        </Link>
                    ) : (
                        <img
                            src={userAvatar}
                            alt={userName}
                            className="h-10 w-10 rounded-full object-cover shrink-0 ring-1 ring-border"
                        />
                    )}

                    <div className="min-w-0 flex flex-col">
                        {lotId ? (
                            <Link
                                href={lotUrl}
                                className="truncate hover:underline"
                                title={lot.name}
                                aria-label={`Open lot ${lot.name}`}
                            >
                                {lot.name}
                            </Link>
                        ) : (
                            <span className="truncate opacity-70">{lot.name}</span>
                        )}

                        {userUrl ? (
                            <Link
                                href={userUrl}
                                className="text-xs text-muted-foreground truncate hover:underline"
                                aria-label={`Open profile of ${userName}`}
                                title={userName}
                            >
                                {userName}
                            </Link>
                        ) : (
                            <div className="text-xs text-muted-foreground truncate">{userName}</div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            <div className="px-4 pb-2">
                <div className="relative w-full overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[16/9]">
                    {lot.status && lot.status !== "confirmed" && (
                        <div className="absolute left-2 top-2 z-20">
              <span
                  className={[
                      "rounded-full px-2 py-1 text-[11px] font-medium backdrop-blur border",
                      lot.status === "pending"
                          ? "bg-amber-50/80 text-amber-700 border-amber-200"
                          : "bg-red-50/80 text-red-700 border-red-200",
                  ].join(" ")}
              >
                {lot.status === "pending" ? "Pending" : "Rejected"}
              </span>
                            {/* или <StatusBadge status={lot.status} /> если используешь компонент */}
                        </div>
                    )}

                    <div className="absolute right-2 top-2 z-20 pointer-events-none">
                        {lotId ? (
                            <FavouriteToggle
                                lotId={lotId}
                                initialLiked={initialLiked}
                                initialCount={initialCount}
                                className="pointer-events-auto"
                                size="md"
                                showCount
                            />
                        ) : null}
                    </div>

                    <img
                        src={coverUrl}
                        alt={`${lot.name} cover`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-200 ease-out group-hover:brightness-75 group-hover:blur-[1px]"
                        loading="lazy"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 ease-out" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                        <div className="bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pt-10 pb-3">
                            <div className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-1 text-white drop-shadow">
                                <span className="text-[11px] opacity-80">Type</span>
                                <span className="text-sm">{lot.lot_type}</span>

                                <span className="text-[11px] opacity-80">Size</span>
                                <span className="text-sm">{lot.lot_size}</span>

                                <span className="text-[11px] opacity-80">Content</span>
                                <span className="text-sm">{lot.content_type}</span>

                                <span className="text-[11px] opacity-80">Furnishing</span>
                                <span className="text-sm">{lot.furnishing}</span>

                                {!isCommunity && (
                                    <>
                                        <span className="text-[11px] opacity-80">Bedrooms</span>
                                        <span className="text-sm">{lot.bedrooms ?? 0}</span>

                                        <span className="text-[11px] opacity-80">Bathrooms</span>
                                        <span className="text-sm">{lot.bathrooms ?? 0}</span>
                                    </>
                                )}
                            </div>

                            <div className="mt-3 pointer-events-auto">
                                {lotId ? (
                                    <Button asChild variant="secondary" className="w-full">
                                        <Link href={lotUrl}>
                                            View lot
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="secondary" className="w-full" disabled>
                                        View lot
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
