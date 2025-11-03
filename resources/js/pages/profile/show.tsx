import React from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, CalendarDays, Folder, Heart } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {LotCard} from "@/components/lot-card";
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
    latestLots: any[];
    isOwner: boolean;
};

export default function PublicUserShow({ user, stats, latestLots, isOwner }: Props) {
    const avatar = user.avatar_url;

    return (
        <MainLayout>
            <Head title={`${user.name} — Profile`} />
            <div className="container mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                    <img
                        src={avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
                    />
                    <div className="flex-1">
                        <h1 className="text-2xl font-semibold">{user.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            <CalendarDays className="mr-1 inline-block h-4 w-4" />
                            Joined {dayjs(user.created_at).format("MMMM D, YYYY")} (
                            {dayjs(user.created_at).fromNow()})
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
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
                                    href={`https://www.ea.com/games/the-sims/the-sims-4/pc/gallery/search/${encodeURIComponent(
                                        user.sims_gallery_id
                                    )}`}
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
                                <Link href="/profile">
                                    <Button variant="ghost">Go to my profile</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* About */}
                {(user.about || user.external_url || user.sims_gallery_id) && (
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>About</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {user.about ? (
                                <p className="whitespace-pre-line leading-relaxed">{user.about}</p>
                            ) : (
                                <p className="text-sm text-muted-foreground">No bio yet.</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Stats */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Folder className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Lots</p>
                                <p className="text-xl font-semibold">{stats.lots}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Heart className="h-5 w-5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Favourites</p>
                                <p className="text-xl font-semibold">{stats.favourites}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Latest lots */}
                <div className="mt-8">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Latest lots</h2>
                    </div>

                    {latestLots.length ? (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {latestLots.map((lot) => (
                                <LotCard key={lot.id} lot={lot} />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-6 text-sm text-muted-foreground">
                                No lots yet.
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
