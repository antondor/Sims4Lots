import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lot } from "@/types/lots";
import { Pencil, ArrowLeft } from "lucide-react";
import { route } from "ziggy-js";
import { LotDownloadButton } from "@/components/lots/lot-download-button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import {LotSpecsGrid, SpecItem} from "@/components/lots/lot-specs";
import {LotAuthor} from "@/components/lots/lot-author";
import {toast} from "sonner";
import {PageHeader} from "@/components/page-header";

type PageProps = {
    lot: Lot;
    isOwner: boolean;
    isFavorited: boolean;
    isAdmin: boolean;
};

export default function LotShow(props: PageProps) {
    const { lot, isOwner } = props;
    const { isAdmin } = (usePage().props as unknown as PageProps);

    const canModerate = isAdmin && lot.status !== "confirmed";

    const approve = () => {
        router.patch(route("admin.lots.approve", lot.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success("Lot approved"),
            onError: () => toast.error("Failed to approve lot"),
        });
    };

    const reject = () => {
        router.patch(route("admin.lots.invalidate", lot.id), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success("Lot rejected"),
            onError: () => toast.error("Failed to reject lot"),
        });
    };

    const images = lot.images ?? [];
    const hasImages = images.length > 0;
    const manyImages = images.length > 1;

    const initialLiked = props.isFavorited;
    const initialCount = lot.favorites_count ?? 0;

    return (
        <MainLayout>
            <Head title={lot.name} />
            <PageHeader
                breadcrumbs={[
                    { title: "Home", href: route("dashboard") },
                    { title: lot.name },
                ]}
            />

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
                        {canModerate && lot.status === "pending" && (
                            <div className="flex gap-2">
                                <Button onClick={approve}>Approve</Button>
                                <Button variant="destructive" onClick={reject}>Reject</Button>
                            </div>
                        )}

                        <FavouriteToggle
                            lotId={lot.id}
                            initialLiked={initialLiked}
                            initialCount={initialCount}
                            size="md"
                            showCount
                        />

                        <LotDownloadButton href={lot.download_link} />

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

                <Card className="mb-6">
                    <CardContent className="p-3 md:p-4">
                        {hasImages ? (
                            <div className="w-full">
                                <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                                    <Carousel className="h-full w-full">
                                        <CarouselContent className="h-full">
                                            {images
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
                            <LotSpecsGrid>
                                <SpecItem label="Lot size" value={lot.lot_size} />
                                <SpecItem label="Content" value={lot.content_type} />
                                <SpecItem label="Furnishing" value={lot.furnishing} />
                                <SpecItem label="Type" value={lot.lot_type} />
                                <SpecItem label="Bedrooms" value={lot.bedrooms ?? "—"} />
                                <SpecItem label="Bathrooms" value={lot.bathrooms ?? "—"} />
                            </LotSpecsGrid>
                        </section>

                        {(lot.creator_id || lot.creator_link) && (
                            <section className="rounded-xl border p-4 md:p-5">
                                <h2 className="mb-3 text-lg font-medium">Creator</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    {lot.creator_id && <Badge variant="secondary">{lot.creator_id}</Badge>}
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
                        <LotAuthor
                            name={lot.user?.name}
                            avatarUrl={lot.user?.avatar_url}
                        />
                    </aside>
                </div>
            </div>
        </MainLayout>
    );
}
