import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    label?: string;
    onFilesChange: (files: FileList | null) => void;
    previews: string[];
    badIndexes?: number[];
    errors: Record<string, string>;
};

export function ImagesUploader({
                                   label = "Add images — 16:9 (≥1280×720), up to 10 files",
                                   onFilesChange,
                                   previews,
                                   badIndexes = [],
                                   errors,
                               }: Props) {
    const badSet = React.useMemo(() => new Set(badIndexes), [badIndexes]);

    const imageErrors = React.useMemo(
        () =>
            [...new Set(
                Object.entries(errors)
                    .filter(([k]) => k === "images" || k.startsWith("images."))
                    .map(([, v]) => String(v))
            )],
        [errors]
    );

    return (
        <div className="sm:col-span-2 space-y-2">
            <Label htmlFor="images">{label}</Label>
            <p className="text-xs text-muted-foreground">New images will be appended to the end of the gallery.</p>

            <Input id="images" type="file" multiple accept="image/*" onChange={(e) => onFilesChange(e.target.files)} />

            {imageErrors.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm text-red-500">
                    {imageErrors.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
            )}

            {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((src, i) => {
                        const isBad = badSet.has(i);
                        return (
                            <div
                                key={i}
                                className={[
                                    "overflow-hidden rounded-xl border",
                                    isBad ? "border-red-500 ring-2 ring-red-500" : "border-border",
                                ].join(" ")}
                                title={isBad ? "This image fails 16:9 (≥1280×720) validation" : undefined}
                                aria-invalid={isBad || undefined}
                            >
                                <img src={src} alt={`new-preview-${i}`} className="h-28 w-full object-cover" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
