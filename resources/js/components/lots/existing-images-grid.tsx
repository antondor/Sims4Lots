// resources/js/components/lots/ExistingImagesGrid.tsx
import React from "react";
import type { LotImage } from "@/types/lots";
import { Trash2, Star } from "lucide-react";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";

type Props = {
    lotId: number;
    images: LotImage[];
    badIds?: number[];
    errorMessages?: string[];
};

export function ExistingImagesGrid({ lotId, images, badIds = [], errorMessages = [] }: Props) {
    const badSet = React.useMemo(() => new Set(badIds), [badIds]);

    const deleteImage = (imageId: number) => {
        router.delete(route("lots.images.destroy", { lot: lotId, image: imageId }), {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["lot"] }),
        });
    };

    const makeCover = (imageId: number) => {
        router.patch(route("lots.images.cover", { lot: lotId, image: imageId }), {}, {
            preserveScroll: true,
            onSuccess: () => router.reload({ only: ["lot"] }),
        });
    };

    if (images.length === 0) {
        return <p className="text-sm text-muted-foreground">No images yet.</p>;
    }

    return (
        <div className="space-y-3">
            {errorMessages.length > 0 && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                    <p className="mb-1 text-sm font-medium text-red-600">Some images have issues:</p>
                    <ul className="list-disc pl-5 text-sm text-red-600">
                        {[...new Set(errorMessages)].map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((img) => {
                    const isCover = img.position === 0;
                    const isBad = badSet.has(img.id);

                    return (
                        <div
                            key={img.id}
                            className={[
                                "group relative overflow-hidden rounded-xl border",
                                isBad ? "border-red-500 ring-2 ring-red-500" : "border-border",
                            ].join(" ")}
                            aria-invalid={isBad || undefined}
                            title={isBad ? "This image failed server validation" : undefined}
                        >
                            <img src={img.url} alt={`image-${img.id}`} className="h-36 w-full object-cover" />

                            {isCover && (
                                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-xs font-medium text-white shadow">
                  <Star className="h-3.5 w-3.5" />
                  Cover
                </span>
                            )}

                            <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition group-hover:opacity-100">
                                {!isCover && (
                                    <button
                                        type="button"
                                        onClick={() => makeCover(img.id)}
                                        className="rounded-md bg-background/90 px-2 py-1 text-xs ring-1 ring-border hover:bg-background"
                                        title="Make cover"
                                    >
                                        Make cover
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => deleteImage(img.id)}
                                    className="inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs ring-1 ring-border hover:bg-background"
                                    title="Delete image"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
