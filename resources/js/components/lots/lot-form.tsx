import React, { useEffect } from "react";
import { TextField } from "@/components/upload-form/text-field";
import { SelectField } from "@/components/upload-form/select-field";
import { ImageUpload } from "@/components/upload-form/image-upload";
import { DownloadSourceSelector } from "@/components/lots/download-source-selector";
import { RichTextEditor } from "@/components/common/rich-text-editor";
import { Label } from "@/components/ui/label";

type Enums = {
    lot_sizes: readonly string[];
    content_types: readonly string[];
    furnishings: readonly string[];
    lot_types: readonly string[];
};

export type LotData = {
    name: string;
    description: string | null;
    creator_link: string | null;
    download_link: string | null;
    gallery_id: string | null;
    lot_size: string;
    content_type: string;
    furnishing: string;
    lot_type: string;
    bedrooms: number | string;
    bathrooms: number | string;
    images?: File[];
};

type Props = {
    data: LotData;
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
    enums: Enums;
    previews?: string[];
    onFilesChange?: (files: FileList | null) => void;
    badSet?: Set<number>;
};

export function LotForm({ data, setData, errors, enums, previews, onFilesChange, badSet }: Props) {
    const isCommunity = data.lot_type === "Community";

    useEffect(() => {
        if (isCommunity) {
            if (data.bedrooms !== "") setData("bedrooms", "");
            if (data.bathrooms !== "") setData("bathrooms", "");
        }
    }, [isCommunity]);

    return (
        <div className="grid gap-6 sm:grid-cols-2">

            <div className="sm:col-span-2">
                <TextField
                    id="name"
                    label="Name"
                    value={data.name}
                    onChange={(v) => setData("name", v)}
                    placeholder="Willow Creek Cottage"
                    error={errors.name}
                />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <RichTextEditor
                    value={data.description ?? ""}
                    onChange={(v) => setData("description", v)}
                    placeholder="Describe your lot..."
                    error={errors.description}
                    className="min-h-[200px]"
                />
                {errors.description && (
                    <p className="text-xs text-red-600">{errors.description}</p>
                )}
            </div>

            <div className="sm:col-span-2">
                <DownloadSourceSelector data={data} setData={setData} errors={errors} />
            </div>

            <SelectField
                label="Lot size"
                value={data.lot_size}
                onValueChange={(v) => setData("lot_size", v)}
                options={enums.lot_sizes}
                error={errors.lot_size}
            />

            <SelectField
                label="Content type"
                value={data.content_type}
                onValueChange={(v) => setData("content_type", v)}
                options={enums.content_types}
                error={errors.content_type}
            />

            <SelectField
                label="Furnishing"
                value={data.furnishing}
                onValueChange={(v) => setData("furnishing", v)}
                options={enums.furnishings}
                error={errors.furnishing}
            />

            <SelectField
                label="Lot type"
                value={data.lot_type}
                onValueChange={(v) => setData("lot_type", v)}
                options={enums.lot_types}
                error={errors.lot_type}
            />

            <TextField
                id="bedrooms"
                label="Bedrooms"
                type="number"
                value={String(data.bedrooms)}
                onChange={(v) => setData("bedrooms", v)}
                placeholder={isCommunity ? "N/A for Community" : "e.g. 3"}
                disabled={isCommunity}
                error={errors.bedrooms}
            />

            <TextField
                id="bathrooms"
                label="Bathrooms"
                type="number"
                value={String(data.bathrooms)}
                onChange={(v) => setData("bathrooms", v)}
                placeholder={isCommunity ? "N/A for Community" : "e.g. 2"}
                disabled={isCommunity}
                error={errors.bathrooms}
            />

            {onFilesChange && (
                <div className="sm:col-span-2">
                    <ImageUpload
                        label="Add new images"
                        helper="Tip: 16:9 looks best. These will be added to existing ones."
                        onChange={onFilesChange}
                        errors={errors}
                        previews={previews || []}
                        badSet={badSet || new Set()}
                    />
                </div>
            )}
        </div>
    );
}