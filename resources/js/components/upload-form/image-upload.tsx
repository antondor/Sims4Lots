import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ImageUpload({
                                label,
                                helper,
                                onChange,
                                errors,
                                previews,
                                badSet,
                            }: {
    label: string;
    helper?: string;
    onChange: (files: FileList | null) => void;
    errors: Record<string, string>;
    previews: string[];
    badSet: Set<number>;
}) {
    const imageErrors = useMemo(
        () =>
            Object.entries(errors)
                .filter(([k]) => k === "images" || k.startsWith("images."))
                .map(([, v]) => String(v)),
        [errors]
    );

    return (
        <div className="space-y-2">
            <Label htmlFor="images">{label}</Label>
            {helper ? <p className="text-xs text-muted-foreground">{helper}</p> : null}
            <Input id="images" type="file" multiple accept="image/*" onChange={(e) => onChange(e.target.files)} />
            {imageErrors.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm text-red-500">
                    {[...new Set(imageErrors)].map((msg, i) => (
                        <li key={i}>{msg}</li>
                    ))}
                </ul>
            )}
            {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                    {previews.map((src, i) => {
                        const isBad = badSet.has(i);
                        return (
                            <div
                                key={i}
                                className={["overflow-hidden rounded-xl border", isBad ? "border-red-500 ring-2 ring-red-500" : "border-border"].join(" ")}
                                title={isBad ? "This image fails 16:9 (≥1280×720) validation" : undefined}
                                aria-invalid={isBad || undefined}
                            >
                                <img src={src} alt={`preview-${i}`} className="h-28 w-full object-cover" />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
