import React, { useState, useEffect } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Lot } from "@/types/lots";
import { ImageIcon, X, Maximize2 } from "lucide-react";

type Props = {
    lotName: string;
    images: NonNullable<Lot["images"]>;
};

export const LotImagesCard: React.FC<Props> = ({ lotName, images }) => {
    const hasImages = images.length > 0;
    const sortedImages = images.slice().sort((a, b) => a.position - b.position);

    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        api.on("select", () => {
            setCurrentSlide(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="w-full">
            {hasImages ? (
                <div className="group relative aspect-video w-full overflow-hidden rounded-xl border bg-secondary/20">
                    <Carousel
                        setApi={setApi}
                        className="h-full w-full"
                        opts={{ loop: true, align: "start" }}
                    >
                        <CarouselContent className="-ml-0 h-full">
                            {sortedImages.map((img, index) => (
                                <CarouselItem key={img.id} className="h-full basis-full pl-0">
                                    <div className="relative h-full w-full flex items-center justify-center bg-black/5">
                                        <img
                                            src={img.url}
                                            alt={`${lotName} ${index + 1}`}
                                            className="h-full w-auto mx-auto"
                                            loading="lazy"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        {sortedImages.length > 1 && (
                            <>
                                <CarouselPrevious className="left-2 hidden sm:flex bg-white/80 hover:bg-white border-none" />
                                <CarouselNext className="right-2 hidden sm:flex bg-white/80 hover:bg-white border-none" />
                            </>
                        )}
                    </Carousel>

                    <Button
                        size="sm"
                        variant="secondary"
                        className="absolute bottom-3 right-3 z-10 gap-2 shadow-sm bg-white/90 hover:bg-white text-foreground md:hidden"
                        onClick={() => setIsOpen(true)}
                    >
                        <Maximize2 className="h-4 w-4" />
                        <span className="hidden sm:inline">View images</span>
                    </Button>

                    <Badge variant="secondary" className="absolute bottom-3 left-3 z-10 bg-black/60 text-white hover:bg-black/70 border-none px-2">
                        {sortedImages.length} images
                    </Badge>
                </div>
            ) : (
                <div className="flex aspect-video w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <ImageIcon className="h-8 w-8 opacity-50" />
                        <span className="text-sm">No images</span>
                    </div>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    className="
                        max-w-5xl w-full
                        bg-transparent border-none shadow-none
                        p-0
                        overflow-visible
                        flex flex-col items-center justify-center
                        [&>button]:hidden
                    "
                >
                    <div className="relative w-full h-[80vh] flex items-center justify-center pointer-events-none">

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 z-50 text-white bg-black/40 hover:bg-black/60 rounded-full h-10 w-10 pointer-events-auto backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <div className="w-full h-full pointer-events-auto">
                            <FullscreenCarousel
                                images={sortedImages}
                                startIndex={currentSlide}
                                lotName={lotName}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const FullscreenCarousel = ({ images, startIndex, lotName }: { images: any[], startIndex: number, lotName: string }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.scrollTo(startIndex, true);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api, startIndex]);

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
            <Carousel setApi={setApi} className="w-full h-full flex items-center justify-center" opts={{ loop: true }}>
                <CarouselContent className="h-full -ml-4">
                    {images.map((img) => (
                        <CarouselItem key={img.id} className="pl-4 h-full flex items-center justify-center">
                            <img
                                src={img.url}
                                alt={lotName}
                                className="max-h-full max-w-full object-contain"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>

                <CarouselPrevious className="left-2 md:-left-12 bg-white/10 text-white hover:bg-white/20 border-none h-10 w-10" />
                <CarouselNext className="right-2 md:-right-12 bg-white/10 text-white hover:bg-white/20 border-none h-10 w-10" />
            </Carousel>

            <div className="absolute -bottom-8 text-white/70 text-sm font-medium">
                {current} / {count}
            </div>
        </div>
    );
};
