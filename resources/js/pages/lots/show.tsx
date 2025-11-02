import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lot } from "@/types/lots";
import { PaginatedData } from "@/types";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Heart, Pencil, ArrowLeft } from "lucide-react";
import {route} from "ziggy-js";

export default function LotShow({
                                    lot,
                                    isOwner,
                                }: {
    lot: Lot & {
        user?: { id: number; name: string; email?: string; avatar_url?: string };
        images: { id: number; url: string; position: number }[];
    };
    isOwner: boolean;
}) {
    const { post, processing } = useForm();

    const toggleFavourite = () => {
        post(route("lots.favorite.toggle", lot.id), { preserveScroll: true });
    };

    return (
        <MainLayout>
            <Head title={lot.name} />

            <div className="container mx-auto max-w-screen-xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href={route("dashboard")}>
                            <Button variant="ghost" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-semibold">{lot.name}</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="gap-2" onClick={toggleFavourite} disabled={processing}>
                            <Heart className="h-4 w-4" />
                            Favourite
                        </Button>
                        {isOwner && (
                            <Link href={route("lots.edit", lot.id)}>
                                <Button variant="secondary" className="gap-2">
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Галерея */}
                <Card className="mb-6">
                    <CardContent className="p-3 md:p-4">
                        {lot.images.length > 0 ? (
                            <div className="w-full">
                                <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                                    <Carousel className="h-full w-full">
                                        <CarouselContent className="h-full">
                                            {lot.images.map((img) => (
                                                <CarouselItem key={img.id} className="h-full basis-full">
                                                    <img
                                                        src={img.url}
                                                        alt={`${lot.name} image ${img.position}`}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-10" />
                                        <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-10" />
                                    </Carousel>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video w-full rounded-xl border bg-muted" />
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Инфо */}
                    <Card className="lg:col-span-2">
                        <CardContent className="p-4 md:p-6 space-y-4">
                            {lot.description && (
                                <div>
                                    <h2 className="mb-2 text-lg font-medium">Description</h2>
                                    <p className="text-muted-foreground whitespace-pre-line">{lot.description}</p>
                                </div>
                            )}

                            <div>
                                <h2 className="mb-2 text-lg font-medium">Details</h2>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    <InfoItem label="Lot size" value={lot.lot_size} />
                                    <InfoItem label="Content" value={lot.content_type} />
                                    <InfoItem label="Furnishing" value={lot.furnishing} />
                                    <InfoItem label="Type" value={lot.lot_type} />
                                    <InfoItem label="Bedrooms" value={lot.bedrooms ?? "—"} />
                                    <InfoItem label="Bathrooms" value={lot.bathrooms ?? "—"} />
                                </div>
                            </div>

                            {(lot.creator_id || lot.creator_link) && (
                                <div>
                                    <h2 className="mb-2 text-lg font-medium">Creator</h2>
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary">{lot.creator_id || "Unknown"}</Badge>
                                        {lot.creator_link && (
                                            <a
                                                href={lot.creator_link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm text-primary underline underline-offset-4"
                                            >
                                                Gallery link
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Автор */}
                    <Card>
                        <CardContent className="p-4 md:p-6">
                            <h2 className="mb-3 text-lg font-medium">Author</h2>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 overflow-hidden rounded-full border">
                                    <img
                                        src={lot.user?.avatar_url ?? "/images/profile_avatar_placeholder.png"}
                                        alt={lot.user?.name ?? "User"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="truncate font-medium">{lot.user?.name ?? "Unknown"}</div>
                                    {lot.user?.email && (
                                        <div className="truncate text-sm text-muted-foreground">{lot.user.email}</div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="font-medium">{value}</div>
        </div>
    );
}
