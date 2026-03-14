import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    label: string;
    helper?: string;
    images: File[];
    setImages: (files: File[]) => void;
    errors: Record<string, string>;
    badSet: Set<number>;
}

export function ImageUpload({ label, helper, images, setImages, errors, badSet }: Props) {
    const previews = useMemo(() => images.map(f => URL.createObjectURL(f)), [images]);

    React.useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    const imageErrors = useMemo(() =>
        Object.entries(errors)
            .filter(([k]) => k === "images" || k.startsWith("images."))
            .map(([, v]) => String(v)),
        [errors]
    );

    const onAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const newFiles = Array.from(e.target.files);
        setImages([...images, ...newFiles]);
        e.target.value = "";
    };

    const onRemove = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const onMove = (from: number, to: number) => {
        const updated = [...images];
        [updated[from], updated[to]] = [updated[to], updated[from]];
        setImages(updated);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="images" className="text-base font-semibold">{label}</Label>
            {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}

            <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                className="cursor-pointer"
                onChange={onAdd}
            />

            {imageErrors.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {[...new Set(imageErrors)].map((msg, i) => (
                        <li key={i} className="text-sm font-medium text-destructive">{msg}</li>
                    ))}
                </ul>
            )}

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
                {previews.map((src, i) => {
                    const isBad = badSet.has(i);
                    return (
                        <div key={src} className={[
                            "group relative aspect-[16/9] overflow-hidden rounded-xl border bg-muted transition-all",
                            isBad ? "border-destructive ring-2 ring-destructive/20" : "border-border hover:border-primary/50",
                        ].join(" ")}>
                            <img src={src} className="h-full w-full object-cover" alt="" />

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute right-2 top-2 z-10 h-7 w-7 transition md:opacity-0 md:group-hover:opacity-100"
                                onClick={() => onRemove(i)}
                            >
                                <X className="h-4 w-4" />
                            </Button>

                            <div className="absolute left-2 top-2 z-10 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                {`#${i + 1}`}
                            </div>

                            {i > 0 && (
                                <div className="absolute inset-y-0 left-0 flex items-center pl-1 transition md:opacity-0 md:group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full shadow-lg"
                                        onClick={() => onMove(i, i - 1)}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                </div>
                            )}

                            {i < previews.length - 1 && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-1 transition md:opacity-0 md:group-hover:opacity-100">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full shadow-lg"
                                        onClick={() => onMove(i, i + 1)}
                                    >
                                        <ChevronRight className="h-6 w-6" />
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
