import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CalendarDays, Folder, Heart, Link as LinkIcon, Edit3, ShieldCheck, User as UserIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LotCard } from "@/components/lot-card";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import type { BreadcrumbItem } from "@/types";
import { SafeHtml } from "@/components/common/safe-html";

dayjs.extend(relativeTime);

type UserDto = {
    id: number;
    name: string;
    avatar_url: string;
    about?: string | null;
    short_about?: string | null;
    external_url?: string | null;
    sims_gallery_id?: string | null;
    created_at: string;
    last_seen_at?: string | null;
    is_online?: boolean;
    is_admin?: number | boolean;
};

type Props = {
    user: UserDto;
    stats: { lots: number; favourites: number };
    latestLots: (Lot & { favorites_count?: number; is_favorited?: boolean })[];
    isOwner: boolean;
    topLot: (Lot & { favorites_count?: number; is_favorited?: boolean }) | null;
};

export default function PublicUserShow({ user, stats, latestLots, isOwner, topLot }: Props) {
    const canShowFavourite = (lot: Lot) => lot.status === "confirmed";
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "Users", href: route("users.index") },
        { title: user.name },
    ];

    const lots = latestLots ?? [];
    const hasLots = lots.length > 0;

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name} • profile`} />

            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8 mb-10">
                    <div className="shrink-0 text-center md:text-left">
                        <div className="relative mx-auto inline-block md:mx-0">
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-28 w-28 rounded-full object-cover ring-4 ring-background shadow-lg md:h-32 md:w-32"
                            />
                            {user.is_online && (
                                <span className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <div className="flex items-center justify-center gap-3 md:justify-start">
                                <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                {user.is_admin && (
                                    <div className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Admin
                                    </div>
                                )}
                            </div>

                            {user.short_about && (
                                <p className="mt-2 text-lg text-muted-foreground">{user.short_about}</p>
                            )}
                            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground md:justify-start">
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4" />
                                    Joined {dayjs(user.created_at).format("MMMM YYYY")}
                                </span>
                                {!user.is_online && user.last_seen_at && (
                                    <span>Last seen {dayjs(user.last_seen_at).fromNow()}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                            {isOwner && (
                                <Link href={route("profile.edit")}>
                                    <Button size="sm" className="gap-2">
                                        <Edit3 className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </Link>
                            )}

                            {user.external_url && (
                                <a href={user.external_url} target="_blank" rel="noreferrer">
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <ExternalLink className="h-4 w-4" />
                                        Website
                                    </Button>
                                </a>
                            )}

                            {isOwner && (
                                <Link href={route("myLots")}>
                                    <Button variant="ghost" size="sm" className="gap-2">
                                        <Folder className="h-4 w-4" />
                                        My Lots
                                    </Button>
                                </Link>
                            )}
                            <Link href={route("favourites.index", { user: user.id })}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <Heart className="h-4 w-4" />
                                    {isOwner ? "My Favourites" : "Favourites"}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {user.about && (
                    <Card className="mb-10 gap-0">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <UserIcon className="h-4 w-4 text-muted-foreground" />
                                About
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                <SafeHtml content={user.about} />
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="order-2 space-y-8 lg:order-1 lg:col-span-8">
                        {topLot && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    Top Rated
                                </h3>
                                <LotCard lot={topLot} />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Latest Uploads</h3>
                            </div>

                            {!hasLots ? (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                        <Folder className="mb-3 h-10 w-10 opacity-20" />
                                        <p>No lots published yet.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {lots.map((lot) => {
                                        const cover = (lot as any).cover_image?.url ?? lot.images?.[0]?.url ?? "/images/lot-placeholder.jpg";
                                        const favCount = (lot as any).favorites_count ?? 0;

                                        return (
                                            <div key={lot.id} className="group relative flex gap-4 overflow-hidden rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50">
                                                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md bg-muted">
                                                    <img
                                                        src={cover}
                                                        alt={lot.name}
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="flex flex-1 flex-col justify-between py-0.5">
                                                    <div className="space-y-1">
                                                        <Link href={route("lots.view", { lot: lot.id })} className="block font-medium leading-tight hover:underline">
                                                            <span className="absolute inset-0 z-10" />
                                                            {lot.name}
                                                        </Link>
                                                        <div className="text-xs text-muted-foreground">
                                                            {lot.lot_type} • {lot.lot_size}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">{dayjs(lot.created_at).fromNow()}</span>
                                                        {canShowFavourite(lot) && (
                                                            <div className="relative z-20">
                                                                <FavouriteToggle
                                                                    lotId={lot.id}
                                                                    initialLiked={Boolean((lot as any).is_favorited)}
                                                                    initialCount={favCount}
                                                                    size="sm"
                                                                    showCount
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="order-1 space-y-6 lg:order-2 lg:col-span-4">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                Information
                            </h3>
                            <Card>
                                <CardContent className="space-y-6 pt-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <LinkIcon className="h-4 w-4" />
                                                Website
                                            </span>
                                            {user.external_url ? (
                                                <a href={user.external_url} target="_blank" rel="noreferrer" className="max-w-[150px] truncate font-medium text-primary hover:underline">
                                                    {new URL(user.external_url).hostname}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2 text-muted-foreground">
                                                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12.87 20.69c-3.1 1.77-6.23-1.6-9.13-4.5S-.9 9.8 1.87 8.2c1.78-1.03 3.96-.34 4.54 1.43.34 1.04-.54 2.22-1.63 2.68a2.1 2.1 0 00-1.25 1.96c.03 2.1 2.87 4.95 4.97 4.97a2.1 2.1 0 001.96-1.25c.46-1.09 1.64-1.97 2.68-1.63 1.77.58 2.46 2.76 1.43 4.54-.57.99-1.23 1.54-1.7 1.8zm3.56-5.46c-1.52-.5-3.05.65-3.66 2.07-.35.8-2.6 3.05-3.4 3.4-1.42.6-2.58 2.13-2.07 3.66.75 2.27 3.9 1.53 7.82-2.39 3.92-3.92 4.66-7.07 2.39-7.82-1.53-.5-3.06.66-3.66 2.08-.36.8-2.6 3.05-3.4 3.4-1.43.6-2.58 2.13-2.08 3.66.75 2.27 3.9 1.53 7.82-2.39 3.92-3.92 4.66-7.07 2.39-7.82h-.01z" /></svg>
                                                Gallery ID
                                            </span>
                                            <span className="font-medium">{user.sims_gallery_id || "—"}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{stats.lots}</div>
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lots</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold">{stats.favourites}</div>
                                            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Top Like
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}