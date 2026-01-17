import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ArrowRight,
    Home,
    Building2,
    Maximize2,
    Package,
    Sofa,
    BedDouble,
    Bath,
} from "lucide-react";
import type { Lot } from "@/types/lots";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { resolveSrc, AVATAR_PLACEHOLDER, IMAGE_PLACEHOLDER } from "@/lib";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import {LotSpecRow} from "@/components/lots/spec-row";

type Props = { lot: Lot & { is_favorited?: boolean; isFavorited?: boolean } };

export function LotCard({ lot }: Props) {
    const userName = lot.user?.name ?? "Unknown user";
    const userAvatar =
        lot.user?.avatar_url ?? resolveSrc(lot.user?.avatar) ?? AVATAR_PLACEHOLDER;

    const lotId = (lot as any).id;
    const lotUrl = lotId ? route("lots.view", { lot: lotId }) : "#";
    const userUrl = lot.user?.id ? route("users.show", { user: lot.user.id }) : null;

    const cover = lot.cover_image ?? (lot.images?.[0] ?? null);
    const coverUrl = cover?.url ? (resolveSrc(cover.url) ?? IMAGE_PLACEHOLDER) : IMAGE_PLACEHOLDER;

    const isCommunity = lot.lot_type === "Community";
    const initialLiked = Boolean((lot as any).is_favorited ?? (lot as any).isFavorited);
    const initialCount = typeof lot.favorites_count === "number" ? lot.favorites_count : 0;
    const canShowFavourite = lot.status === "confirmed";

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
                            <div className="text-xs text-muted-foreground truncate">
                                {userName}
                            </div>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>

            <div className="px-4 pb-2">
                <div className="relative w-full overflow-hidden rounded-xl aspect-[16/9]">
                    <div className="absolute right-2 top-2 z-20 flex items-center gap-2">
                        {lot.status && lot.status !== "confirmed" && (
                            <span
                                className={[
                                    "inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium backdrop-blur border",
                                    lot.status === "pending"
                                        ? "bg-amber-50/80 text-amber-700 border-amber-200"
                                        : "bg-red-50/80 text-red-700 border-red-200",
                                ].join(" ")}
                            >
                                {lot.status === "pending" ? "Pending" : "Rejected"}
                            </span>
                        )}

                        {canShowFavourite && (
                            <div className="pointer-events-none">
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
                        )}
                    </div>

                    <img
                        src={coverUrl}
                        alt={`${lot.name} cover`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-200 ease-out group-hover:brightness-75 group-hover:blur-[1px]"
                        loading="lazy"
                    />

                    <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 ease-out" />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 ease-out">
                        <div className="bg-gradient-to-t from-black/55 via-black/25 to-transparent px-4 pt-10 pb-3 pointer-events-auto">
                            <div className="flex flex-col gap-1 text-white drop-shadow">
                                <LotSpecRow
                                    icon={
                                        isCommunity ? (
                                            <Building2 className="h-3.5 w-3.5" />
                                        ) : (
                                            <Home className="h-3.5 w-3.5" />
                                        )
                                    }
                                    label="Type"
                                    value={lot.lot_type}
                                />

                                <LotSpecRow
                                    icon={<Maximize2 className="h-3.5 w-3.5" />}
                                    label="Size"
                                    value={lot.lot_size}
                                />

                                <LotSpecRow
                                    icon={<Package className="h-3.5 w-3.5" />}
                                    label="Content"
                                    value={lot.content_type}
                                />

                                <LotSpecRow
                                    icon={<Sofa className="h-3.5 w-3.5" />}
                                    label="Furnishing"
                                    value={lot.furnishing}
                                />

                                {!isCommunity && (
                                    <>
                                        {lot.bedrooms !== null ?
                                            <LotSpecRow
                                                icon={<BedDouble className="h-3.5 w-3.5" />}
                                                label="Bedrooms"
                                                value={lot.bedrooms}
                                            /> : null
                                        }

                                        {lot.bedrooms !== null ?
                                            <LotSpecRow
                                                icon={<Bath className="h-3.5 w-3.5" />}
                                                label="Bathrooms"
                                                value={lot.bathrooms}
                                            /> : null
                                        }
                                    </>
                                )}
                            </div>

                            <div className="mt-3">
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

                <div className="mt-3 md:hidden">
                    <div className="rounded-lg border bg-background/70 px-3 py-2">
                        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div className="flex flex-col">
                                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Type
                                </dt>
                                <dd className="text-sm text-foreground">{lot.lot_type}</dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Size
                                </dt>
                                <dd className="text-sm text-foreground">{lot.lot_size}</dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Content
                                </dt>
                                <dd className="text-sm text-foreground">{lot.content_type}</dd>
                            </div>

                            <div className="flex flex-col">
                                <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                    Furnishing
                                </dt>
                                <dd className="text-sm text-foreground">{lot.furnishing}</dd>
                            </div>

                            {!isCommunity && (
                                <>
                                    <div className="flex flex-col">
                                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                            Bedrooms
                                        </dt>
                                        <dd className="text-sm text-foreground">{lot.bedrooms ?? 0}</dd>
                                    </div>

                                    <div className="flex flex-col">
                                        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                            Bathrooms
                                        </dt>
                                        <dd className="text-sm text-foreground">{lot.bathrooms ?? 0}</dd>
                                    </div>
                                </>
                            )}
                        </dl>
                    </div>

                    <div className="mt-2">
                        {lotId ? (
                            <Button asChild variant="outline" className="w-full">
                                <Link href={lotUrl}>
                                    View lot
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" className="w-full" disabled>
                                View lot
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
