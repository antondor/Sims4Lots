import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
    label?: string;
    helper?: string;
    onFilesChange: (files: FileList | null) => void;
    previews: string[];
    badIndexes?: number[];                // ← добавили
    errors?: Record<string, string>;      // ← сделал необязательным
    accept?: string;
    multiple?: boolean;
    id?: string;
    className?: string;
};

export const ImagesUploader: React.FC<Props> = ({
                                                    label = "Add images (up to 10 files)",
                                                    helper = "New images will be appended to the end of the gallery.",
                                                    onFilesChange,
                                                    previews,
                                                    badIndexes = [],                       // ← дефолт
                                                    errors = {},                           // ← дефолт
                                                    accept = "image/*",
                                                    multiple = true,
                                                    id = "images",
                                                    className,
                                                }) => {
    const badSet = React.useMemo(() => new Set(badIndexes), [badIndexes]);

    const imageErrors = React.useMemo(
        () =>
            [
                ...new Set(
                    Object.entries(errors)
                        .filter(([k]) => k === "images" || k.startsWith("images."))
                        .map(([, v]) => String(v))
                ),
            ],
        [errors]
    );

    return (
        <div className={["sm:col-span-2 space-y-2", className].filter(Boolean).join(" ")}>
            <Label htmlFor={id}>{label}</Label>
            <p className="text-xs text-muted-foreground">{helper}</p>

            <Input
                id={id}
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={(e) => onFilesChange(e.target.files)}
            />

            {imageErrors.length > 0 && (
                <ul className="mt-1 list-disc pl-5 text-sm text-red-500">
                    {imageErrors.map((msg, i) => (
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
                                className={[
                                    "overflow-hidden rounded-xl border",
                                    isBad ? "border-red-500 ring-2 ring-red-500" : "border-border",
                                ].join(" ")}
                                title={isBad ? "This image failed validation" : undefined}
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
};
