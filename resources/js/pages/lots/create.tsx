import React, { useMemo, useState, useEffect } from "react"; // ⬅️ добавил useEffect
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { TextField } from "@/components/upload-form/text-field";
import { SelectField } from "@/components/upload-form/select-field";
import { PageHeader } from "@/components/upload-form/page-header";
import { ImageUpload } from "@/components/upload-form/image-upload";

type Enums = {
    lot_sizes: string[];
    content_types: string[];
    furnishings: string[];
    lot_types: string[];
};

export default function CreateLot({ enums }: { enums: Enums }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        description: string | null;
        creator_id: string;
        creator_link: string | null;
        lot_size: string;
        content_type: string;
        furnishing: string;
        lot_type: string;
        bedrooms: number | string;
        bathrooms: number | string;
        images: File[];
    }>({
        name: "",
        description: "",
        creator_id: "",
        creator_link: "",
        lot_size: enums.lot_sizes[0] ?? "20x15",
        content_type: enums.content_types[0] ?? "NoCC",
        furnishing: enums.furnishings[0] ?? "Furnished",
        lot_type: enums.lot_types[0] ?? "Residential",
        bedrooms: "",
        bathrooms: "",
        images: [],
    });

    const [previews, setPreviews] = useState<string[]>([]);

    // ⬇️ состояние "Community"
    const isCommunity = data.lot_type === "Community";

    // ⬇️ при выборе "Community" чистим спальни/ванные
    useEffect(() => {
        if (isCommunity) {
            setData("bedrooms", "");
            setData("bathrooms", "");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isCommunity]);

    const onFilesChange = (files: FileList | null) => {
        const arr = files ? Array.from(files) : [];
        setData("images", arr);
        const readers = arr.map((f) => URL.createObjectURL(f));
        setPreviews(readers);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("lots.store"), {
            forceFormData: true,
            onSuccess: () => {
                previews.forEach((url) => URL.revokeObjectURL(url));
                reset("images");
                setPreviews([]);
            },
        });
    };

    const badIndexes = Object.keys(errors)
        .filter((k) => k.startsWith("images.") && /^\d+$/.test(k.split(".")[1]))
        .map((k) => Number(k.split(".")[1]));
    const badSet = useMemo(() => new Set(badIndexes ?? []), [badIndexes]);

    return (
        <MainLayout>
            <Head title="Create lot" />
            <div className="container mx-auto max-w-screen-md px-4 py-8">
                <PageHeader
                    title="Create new lot"
                    subtitle="Fill the form to publish your Sims 4 lot"
                    right={
                        <Link href={route("dashboard")}>
                            <Button variant="outline">Back</Button>
                        </Link>
                    }
                />

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <TextField
                                id="name"
                                label="Name"
                                value={data.name}
                                onChange={(v) => setData("name", v)}
                                placeholder="Willow Creek Cottage"
                                error={errors.name as string | undefined}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <TextField
                                id="description"
                                label="Description"
                                textarea
                                value={data.description ?? ""}
                                onChange={(v) => setData("description", v)}
                                placeholder="Short description"
                                error={errors.description as string | undefined}
                            />
                        </div>

                        <TextField
                            id="creator_id"
                            label="Creator ID"
                            value={data.creator_id}
                            onChange={(v) => setData("creator_id", v)}
                            placeholder="Your Sims gallery ID"
                            error={errors.creator_id as string | undefined}
                        />

                        <TextField
                            id="creator_link"
                            label="Creator link"
                            value={data.creator_link ?? ""}
                            onChange={(v) => setData("creator_link", v)}
                            placeholder="https://example.com/profile"
                            error={errors.creator_link as string | undefined}
                        />

                        <SelectField
                            label="Lot size"
                            value={data.lot_size}
                            onValueChange={(v) => setData("lot_size", v)}
                            options={enums.lot_sizes}
                            error={errors.lot_size as string | undefined}
                        />

                        <SelectField
                            label="Content type"
                            value={data.content_type}
                            onValueChange={(v) => setData("content_type", v)}
                            options={enums.content_types}
                            error={errors.content_type as string | undefined}
                        />

                        <SelectField
                            label="Furnishing"
                            value={data.furnishing}
                            onValueChange={(v) => setData("furnishing", v)}
                            options={enums.furnishings}
                            error={errors.furnishing as string | undefined}
                        />

                        <SelectField
                            label="Lot type"
                            value={data.lot_type}
                            onValueChange={(v) => setData("lot_type", v)}
                            options={enums.lot_types}
                            error={errors.lot_type as string | undefined}
                        />

                        <TextField
                            id="bedrooms"
                            label="Bedrooms"
                            type="number"
                            value={String(data.bedrooms)}
                            onChange={(v) => setData("bedrooms", v)}
                            placeholder={isCommunity ? "N/A for Community" : "e.g. 3"}
                            disabled={isCommunity}
                            error={errors.bedrooms as string | undefined}
                        />

                        <TextField
                            id="bathrooms"
                            label="Bathrooms"
                            type="number"
                            value={String(data.bathrooms)}
                            onChange={(v) => setData("bathrooms", v)}
                            placeholder={isCommunity ? "N/A for Community" : "e.g. 2"}
                            disabled={isCommunity}
                            error={errors.bathrooms as string | undefined}
                        />

                        <div className="sm:col-span-2">
                            <ImageUpload
                                label="Images — 16:9 (≥1280×720), up to 10 files"
                                helper="Upload widescreen screenshots; other ratios will be rejected."
                                onChange={onFilesChange}
                                errors={errors}
                                previews={previews}
                                badSet={badSet}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route("dashboard")} className="inline-flex">
                            <Button type="button" variant="ghost">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>Create</Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
