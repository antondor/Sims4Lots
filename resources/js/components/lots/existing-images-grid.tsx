import React, { useMemo, useState, useEffect } from "react";
import type { LotImage } from "@/types/lots";
import { X, ChevronLeft, ChevronRight, Star, Save } from "lucide-react";
import { route } from "ziggy-js";
import { router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

type Props = {
    lotId: number;
    images: LotImage[];
    badIds?: number[];
    errorMessages?: string[];
};

export function ExistingImagesGrid({ lotId, images, badIds = [], errorMessages = [] }: Props) {
    const [localImages, setLocalImages] = useState<LotImage[]>([]);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        const sorted = [...images].sort((a, b) => a.position - b.position);
        setLocalImages(sorted);
        setIsDirty(false);
    }, [images]);

    const badSet = useMemo(() => new Set(badIds), [badIds]);

    const deleteImage = (imageId: number) => {
        if (!confirm("Are you sure?")) return;
        router.delete(route("lots.images.destroy", { lot: lotId, image: imageId }), {
            preserveScroll: true,
        });
    };

    const makeCover = (imageId: number) => {
        router.patch(route("lots.images.cover", { lot: lotId, image: imageId }), {}, {
            preserveScroll: true,
        });
    };

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newOrder = [...localImages];
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);

        setLocalImages(newOrder);
        setIsDirty(true);
    };

    const saveOrder = () => {
        router.patch(route("lots.images.reorder", { lot: lotId }), {
            order: localImages.map(img => img.id)
        }, {
            preserveScroll: true,
            onSuccess: () => setIsDirty(false)
        });
    };

    if (images.length === 0) {
        return <p className="text-sm text-muted-foreground">No images yet.</p>;
    }

    return (
        <div className="space-y-4">
            {isDirty && (
                <div className="flex items-center justify-between rounded-lg border border-amber-500/50 bg-amber-500/10 p-3 animate-in fade-in slide-in-from-top-1">
                    <p className="text-sm font-medium text-amber-700">Order changed</p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setLocalImages([...images].sort((a, b) => a.position - b.position));
                                setIsDirty(false);
                            }}
                        >
                            Reset
                        </Button>
                        <Button size="sm" onClick={saveOrder} className="gap-2">
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    </div>
                </div>
            )}

            {errorMessages.length > 0 && (
                <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3">
                    <p className="mb-1 text-sm font-medium text-red-600">Some images have issues:</p>
                    <ul className="list-disc pl-5 text-sm text-red-600">
                        {[...new Set(errorMessages)].map((msg, i) => <li key={i}>{msg}</li>)}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                {localImages.map((img, i) => {
                    const isCover = img.position === 0 && !isDirty;
                    const isBad = badSet.has(img.id);
                    const isFirst = i === 0;
                    const isLast = i === localImages.length - 1;

                    return (
                        <div
                            key={img.id}
                            className={[
                                "group relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted transition-all",
                                isBad ? "border-destructive ring-2 ring-destructive/20" : "border-border hover:border-primary/50",
                            ].join(" ")}
                        >
                            <img src={img.url} className="h-full w-full object-cover" alt="" />

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 z-10 h-7 w-7 transition md:opacity-0 md:group-hover:opacity-100"
                                onClick={() => deleteImage(img.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                {`#${i + 1}`}
                            </div>

                            {!isFirst && (
                                <div className="absolute inset-y-0 left-0 flex items-center pl-1 transition md:opacity-0 md:group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full shadow-lg"
                                        onClick={() => moveImage(i, i - 1)}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                </div>
                            )}

                            {!isLast && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1 transition md:opacity-0 md:group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full shadow-lg"
                                        onClick={() => moveImage(i, i + 1)}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>
                            )}

                            {!isCover && !isDirty && (
                                <div className="absolute inset-x-0 bottom-2 flex justify-center transition md:opacity-0 md:group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="h-7 px-2 text-[10px] font-bold uppercase shadow-md"
                                        onClick={() => makeCover(img.id)}
                                    >
                                        Make Cover
                                    </Button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
