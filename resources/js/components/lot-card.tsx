import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Lot } from "@/types/lots";
import {
    Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import {route} from "ziggy-js";
import { resolveSrc, AVATAR_PLACEHOLDER } from "@/lib";

export function LotCard({ lot }: { lot: Lot }) {
    const userName   = lot.user?.name ?? "Unknown user";
    const userAvatar: string =
        resolveSrc(lot.user?.avatar) ??
        AVATAR_PLACEHOLDER;
    const images = (lot.images ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((img) => ({ ...img, url: resolveSrc(img.url) ?? AVATAR_PLACEHOLDER }));

    return (
        <Card className="w-full max-w-full rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 overflow-hidden text-[15px] md:text-base">
                    <img
                        src={userAvatar}
                        alt={userName}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                        <div className="truncate">{lot.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{userName}</div>
                    </div>
                </CardTitle>
            </CardHeader>

            <div className="px-4 pb-2">
                {images.length > 0 ? (
                    <div className="relative w-full overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[16/9]">
                        <Carousel className="absolute inset-0 h-full">
                            <CarouselContent className="h-full">
                                {images.map((img) => (
                                    <CarouselItem key={img.id} className="basis-full h-full">
                                        <img
                                            src={img.url}
                                            alt={`${lot.name} image ${img.position}`}
                                            className="block h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-3 top-1/2 -translate-y-1/2 z-10" />
                            <CarouselNext className="right-3 top-1/2 -translate-y-1/2 z-10" />
                        </Carousel>
                    </div>
                ) : (
                    <div className="w-full h-64 md:h-80 bg-muted/40 rounded-lg grid place-items-center text-sm text-muted-foreground">
                        No images
                    </div>
                )}
            </div>

            <CardContent className="space-y-2">
                <div className="grid grid-cols-[110px_1fr] gap-x-4 gap-y-1">
                    <span className="text-xs text-muted-foreground">Type</span>
                    <span className="text-sm">{lot.lot_type}</span>

                    <span className="text-xs text-muted-foreground">Size</span>
                    <span className="text-sm">{lot.lot_size}</span>

                    <span className="text-xs text-muted-foreground">Content</span>
                    <span className="text-sm">{lot.content_type}</span>

                    <span className="text-xs text-muted-foreground">Furnishing</span>
                    <span className="text-sm">{lot.furnishing}</span>

                    <span className="text-xs text-muted-foreground">Bedrooms</span>
                    <span className="text-sm">{lot.bedrooms ?? 0}</span>

                    <span className="text-xs text-muted-foreground">Bathrooms</span>
                    <span className="text-sm">{lot.bathrooms ?? 0}</span>
                </div>

                <Button asChild className="mt-3 w-full">
                    <a href={route("lots.view", { lot: lot.id })}>
                        View lot
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
}
