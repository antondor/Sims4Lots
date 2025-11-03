import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    label?: string;
    helper?: string;
    onFilesChange: (files: FileList | null) => void;
    previews: string[];
    accept?: string; // по умолчанию только изображения; можно переопределить
};

export function ImagesUploader({
                                   label = "Images — up to 10 files",
                                   helper = "Tip: 16:9 looks best in cards (≥1280×720). Other sizes are fine.",
                                   onFilesChange,
                                   previews,
                                   accept = "image/*",
                               }: Props) {
    return (
        <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="images">{label}</Label>
            {helper && (
                <p className="text-xs text-muted-foreground">{helper}</p>
            )}

            <Input
                id="images"
                type="file"
                multiple
                accept={accept}
                onChange={(e) => onFilesChange(e.target.files)}
            />

            {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((src, i) => (
                        <div
                            key={i}
                            className="overflow-hidden rounded-xl border border-border"
                        >
                            <img
                                src={src}
                                alt={`new-preview-${i}`}
                                className="h-28 w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
