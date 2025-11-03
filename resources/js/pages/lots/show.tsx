import React from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lot } from "@/types/lots";
import { Heart, Pencil, ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";
import { LotDownloadButton } from "@/components/lots/lot-download-button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

export default function LotShow({
                                    lot,
                                    isOwner,
                                    isFavorited = false,
                                }: {
    lot: Lot & {
        user?: { id: number; name: string; email?: string; avatar_url?: string };
        images: { id: number; url: string; position: number }[];
        download_link?: string | null;
    };
    isOwner: boolean;
    isFavorited?: boolean;
}) {
    const { post, processing } = useForm();
    const [faved, setFaved] = React.useState<boolean>(isFavorited);

    const toggleFavourite = () => {
        setFaved((v) => !v);
        post(route("lots.favorite.toggle", lot.id), {
            preserveScroll: true,
            onError: () => setFaved((v) => !v),
        });
    };

    const hasImages = (lot.images?.length ?? 0) > 0;
    const manyImages = (lot.images?.length ?? 0) > 1;

    return (
        <MainLayout>
            <Head title={lot.name} />

            <div className="container mx-auto max-w-screen-xl px-4 py-8">
                {/* Header */}
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
                        {/* Favourite */}
                        <Button
                            type="button"
                            variant="outline"
                            className={[
                                "gap-2 transition-colors",
                                faved
                                    ? "border-red-400/50 text-red-600 bg-red-50 hover:bg-red-100"
                                    : "hover:bg-muted/60",
                            ].join(" ")}
                            onClick={toggleFavourite}
                            disabled={processing}
                            aria-pressed={faved}
                            title={faved ? "Remove from favourites" : "Add to favourites"}
                        >
                            <Heart className="h-4 w-4" fill={faved ? "currentColor" : "none"} />
                            {faved ? "Favourited" : "Favourite"}
                        </Button>

                        {/* Download (если есть ссылка) */}
                        <LotDownloadButton href={lot.download_link} />

                        {/* Edit */}
                        {isOwner && (
                            <Link href={route("lots.edit", lot.id)}>
                                <Button
                                    variant="secondary"
                                    className="gap-2 transition-[filter,opacity] hover:opacity-90 hover:brightness-95"
                                    title="Edit this lot"
                                >
                                    <Pencil className="h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Gallery — вернули карусель */}
                <Card className="mb-6">
                    <CardContent className="p-3 md:p-4">
                        {hasImages ? (
                            <div className="w-full">
                                <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                                    <Carousel className="h-full w-full">
                                        <CarouselContent className="h-full">
                                            {lot.images
                                                .slice()
                                                .sort((a, b) => a.position - b.position)
                                                .map((img) => (
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

                                        {manyImages && (
                                            <>
                                                <CarouselPrevious
                                                    className="left-3 top-1/2 -translate-y-1/2 z-10"
                                                    aria-label="Previous image"
                                                />
                                                <CarouselNext
                                                    className="right-3 top-1/2 -translate-y-1/2 z-10"
                                                    aria-label="Next image"
                                                />
                                            </>
                                        )}
                                    </Carousel>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-video w-full rounded-xl border bg-muted" />
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {lot.description && (
                            <section className="rounded-xl border p-4 md:p-5">
                                <h2 className="mb-2 text-lg font-medium">Description</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {lot.description}
                                </p>
                            </section>
                        )}

                        <section className="rounded-xl border p-4 md:p-5">
                            <h2 className="mb-3 text-lg font-medium">Details</h2>
                            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                                <SpecItem label="Lot size" value={lot.lot_size} />
                                <SpecItem label="Content" value={lot.content_type} />
                                <SpecItem label="Furnishing" value={lot.furnishing} />
                                <SpecItem label="Type" value={lot.lot_type} />
                                <SpecItem label="Bedrooms" value={lot.bedrooms ?? "—"} />
                                <SpecItem label="Bathrooms" value={lot.bathrooms ?? "—"} />
                            </dl>
                        </section>

                        {(lot.creator_id || lot.creator_link) && (
                            <section className="rounded-xl border p-4 md:p-5">
                                <h2 className="mb-3 text-lg font-medium">Creator</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    {lot.creator_id && (
                                        <Badge variant="secondary">{lot.creator_id}</Badge>
                                    )}
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
                            </section>
                        )}
                    </div>

                    <aside className="rounded-xl border p-4 md:p-5">
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
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
}

function SpecItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-background/50 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
        </div>
    );
}
