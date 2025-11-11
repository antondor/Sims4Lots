import React from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CalendarDays, Folder, Heart, Grid, List } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LotCard } from "@/components/lot-card";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import {PageHeader} from "@/components/page-header";

dayjs.extend(relativeTime);

type UserDto = {
    id: number;
    name: string;
    avatar_url: string;
    about?: string | null;
    external_url?: string | null;
    sims_gallery_id?: string | null;
    created_at: string;
};

type Props = {
    user: UserDto;
    stats: { lots: number; favourites: number };
    latestLots: Lot[];
    isOwner: boolean;
};

export default function PublicUserShow({ user, stats, latestLots, isOwner }: Props) {
    const avatar = user.avatar_url;

    const topLot =
        latestLots && latestLots.length
            ? [...latestLots].reduce(
                (acc, lot) => {
                    const cnt = lot.favorites_count ?? 0;
                    return cnt > acc.count ? { lot, count: cnt } : acc;
                },
                { lot: latestLots[0], count: latestLots[0].favorites_count ?? 0 }
            ).lot
            : null;

    const [view, setView] = React.useState<"compact" | "cards">("compact");

    const lots = latestLots ?? [];
    const hasLots = lots.length > 0;

    const completenessParts = [Boolean(user.about), Boolean(user.external_url), Boolean(user.sims_gallery_id)];
    const completeScore = Math.round((completenessParts.filter(Boolean).length / completenessParts.length) * 100);

    return (
        <MainLayout>
            <Head title={`${user.name} — Profile`} />

            <PageHeader
                breadcrumbs={[
                    { title: "Home", href: route("dashboard") },
                    { title: "Users", href: route("profile.show") },
                    { title: user.name },
                ]}
                title="Profile"
            />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <img src={avatar} alt={user.name} className="h-24 w-24 rounded-full object-cover ring-2 ring-border" />
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{user.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            <CalendarDays className="mr-1 inline-block h-4 w-4" />
                            Joined {dayjs(user.created_at).format("MMMM D, YYYY")} ({dayjs(user.created_at).fromNow()})
                        </p>
                        <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
                            Welcome to {user.name}&apos;s profile!
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {user.external_url && (
                                <a href={user.external_url} target="_blank" rel="noreferrer">
                                    <Button variant="secondary" className="gap-1">
                                        <ExternalLink className="h-4 w-4" />
                                        External portfolio
                                    </Button>
                                </a>
                            )}
                            {user.sims_gallery_id && (
                                <a
                                    href={`https://www.ea.com/games/the-sims/the-sims-4/pc/gallery/search/${encodeURIComponent(user.sims_gallery_id)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Button variant="outline" className="gap-1">
                                        <ExternalLink className="h-4 w-4" />
                                        Sims 4 Gallery
                                    </Button>
                                </a>
                            )}
                            {isOwner && (
                                <Link href={route("profile.edit")}>
                                    <Button className="gap-1">Edit profile</Button>
                                </Link>
                            )}
                            <Link href={route("lots.mine")}>
                                <Button variant="ghost" className="gap-1">
                                    <Folder className="h-4 w-4" />
                                    My lots
                                </Button>
                            </Link>
                            <Link href={route("favourites.index")}>
                                <Button variant="ghost" className="gap-1">
                                    <Heart className="h-4 w-4" />
                                    Favourites
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <Card className="mt-6">
                    <CardHeader className="pb-3">
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {user.about ? (
                            <p className="whitespace-pre-line leading-relaxed">{user.about}</p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No bio yet. {isOwner ? "Add a short introduction in profile settings so others can get to know you." : ""}
                            </p>
                        )}
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            <InfoRow label="Public link" value={user.external_url ?? "—"} />
                            <InfoRow label="Sims 4 Gallery ID" value={user.sims_gallery_id ?? "—"} />
                        </div>
                        {isOwner && (
                            <div className="mt-6 rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed text-muted-foreground">
                                <div className="mb-1 font-medium text-foreground">Profile completeness: {completeScore}%</div>
                                <div>
                                    {completeScore < 100
                                        ? "Add a bio, a public link, or your Gallery ID to help others discover your work."
                                        : "Great work — your profile is fully completed and easier to discover."}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Folder className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Lots</p>
                                <p className="text-xl font-semibold">{stats.lots}</p>
                                <p className="text-[11px] text-muted-foreground">Total publications</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Heart className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Favourites</p>
                                <p className="text-xl font-semibold">{stats.favourites}</p>
                                <p className="text-[11px] text-muted-foreground">Lots saved by you</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Top liked</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            {topLot ? (
                                <div className="flex items-center gap-3">
                                    <img
                                        src={topLot.cover_image?.url ?? topLot.images?.[0]?.url ?? "/images/lot-placeholder.jpg"}
                                        alt={topLot.name}
                                        className="h-14 w-20 rounded object-cover ring-1 ring-border"
                                        loading="lazy"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <Link href={route("lots.view", { lot: topLot.id })} className="line-clamp-2 text-sm font-medium hover:underline">
                                            {topLot.name}
                                        </Link>
                                        <div className="mt-1">
                                            <FavouriteToggle
                                                lotId={topLot.id}
                                                initialLiked={Boolean((topLot as any).is_favorited ?? (topLot as any).isFavorited)}
                                                initialCount={topLot.favorites_count ?? 0}
                                                size="sm"
                                                showCount
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">No lots to highlight yet.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Latest lots</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={view === "compact" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setView("compact")}
                                className="gap-1"
                                title="Compact list"
                            >
                                <List className="h-4 w-4" />
                                List
                            </Button>
                            <Button
                                variant={view === "cards" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setView("cards")}
                                className="gap-1"
                                title="Card grid"
                            >
                                <Grid className="h-4 w-4" />
                                Cards
                            </Button>
                        </div>
                    </div>

                    {!hasLots ? (
                        <Card>
                            <CardContent className="p-6 text-sm text-muted-foreground">
                                Nothing here yet. {isOwner ? "Create your first lot and start building your showcase." : "This creator hasn’t published lots yet."}
                            </CardContent>
                        </Card>
                    ) : view === "compact" ? (
                        <div className="divide-y rounded-lg border">
                            {lots.map((lot) => {
                                const cover = lot.cover_image?.url ?? lot.images?.[0]?.url ?? "/images/lot-placeholder.jpg";
                                const favCount = lot.favorites_count ?? 0;
                                return (
                                    <div key={lot.id} className="flex items-center gap-3 p-3">
                                        <img src={cover} alt={lot.name} className="h-12 w-16 flex-none rounded object-cover ring-1 ring-border" loading="lazy" />
                                        <div className="min-w-0 flex-1">
                                            <Link href={route("lots.view", { lot: lot.id })} className="line-clamp-1 text-sm font-medium hover:underline" title={lot.name}>
                                                {lot.name}
                                            </Link>
                                            <div className="mt-0.5 text-xs text-muted-foreground">
                                                {lot.lot_type} • {lot.lot_size} • {dayjs(lot.created_at).fromNow()}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FavouriteToggle
                                                lotId={lot.id}
                                                initialLiked={Boolean((lot as any).is_favorited ?? (lot as any).isFavorited)}
                                                initialCount={favCount}
                                                size="sm"
                                                showCount
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {lots.map((lot) => (
                                <LotCard key={lot.id} lot={lot} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-background/50 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="max-w-[60%] truncate text-sm font-medium">{value}</dd>
        </div>
    );
}
