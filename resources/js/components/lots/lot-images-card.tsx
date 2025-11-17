import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import type { Lot } from "@/types/lots";

type Props = {
    lotName: string;
    images: NonNullable<Lot["images"]>;
};

export const LotImagesCard: React.FC<Props> = ({ lotName, images }) => {
    const hasImages = images.length > 0;
    const manyImages = images.length > 1;

    return (
        <>
            {hasImages ? (
                <div className="w-full mb-6">
                    <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                        <Carousel className="h-full w-full">
                            <CarouselContent className="h-full">
                                {images
                                    .slice()
                                    .sort((a, b) => a.position - b.position)
                                    .map((img) => (
                                        <CarouselItem
                                            key={img.id}
                                            className="h-full basis-full"
                                        >
                                            <img
                                                src={img.url}
                                                alt={`${lotName} image ${img.position}`}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </CarouselItem>
                                    ))}
                            </CarouselContent>

                            {manyImages && (
                                <>
                                    <CarouselPrevious
                                        className="left-3 top-1/2 z-10 -translate-y-1/2"
                                        aria-label="Previous image"
                                    />
                                    <CarouselNext
                                        className="right-3 top-1/2 z-10 -translate-y-1/2"
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
        </>
    );
};
