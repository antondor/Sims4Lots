import React, { useMemo, useState } from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import type { Enums, Lot } from "@/types/lots";
import { route } from "ziggy-js";
import { ExistingImagesGrid } from "@/components/lots/existing-images-grid";
import { FormActions } from "@/components/lots/form-actions";
import { DeleteLotButton } from "@/components/lots/delete-lot-button";
import { BreadcrumbItem } from "@/types";
import { BackButton } from "@/components/back-button";
import { LotForm, type LotData } from "@/components/lots/lot-form";
import { PageHeader } from "@/components/upload-form/page-header";

export default function EditLot({ lot, enums }: { lot: Lot; enums: Enums }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: lot.name, href: route("lots.view", { lot: lot.id }) },
        { title: "Edit" },
    ];

    const initial: LotData = {
        name: lot.name ?? "",
        description: lot.description ?? "",
        creator_link: lot.creator_link ?? "",
        download_link: (lot as any).download_link ?? "",
        gallery_id: (lot as any).gallery_id ?? "",
        lot_size: lot.lot_size ?? (enums.lot_sizes[0] ?? "20x15"),
        content_type: lot.content_type ?? (enums.content_types[0] ?? "NoCC"),
        furnishing: lot.furnishing ?? (enums.furnishings[0] ?? "Furnished"),
        lot_type: lot.lot_type ?? (enums.lot_types[0] ?? "Residential"),
        bedrooms: lot.bedrooms ?? "",
        bathrooms: lot.bathrooms ?? "",
        images: [],
    };

    const { data, setData, errors, processing } = useForm<LotData>(initial);
    const [previews, setPreviews] = useState<string[]>([]);

    const onFilesChange = (files: FileList | null) => {
        const arr = files ? Array.from(files) : [];
        setData("images", arr);
        setPreviews(arr.map((f) => URL.createObjectURL(f)));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("_method", "PATCH");

        fd.append("name", data.name ?? "");
        fd.append("description", data.description ?? "");
        fd.append("creator_link", data.creator_link ?? "");

        fd.append("download_link", data.download_link ?? "");
        fd.append("gallery_id", data.gallery_id ?? "");

        fd.append("lot_size", data.lot_size);
        fd.append("content_type", data.content_type);
        fd.append("furnishing", data.furnishing);
        fd.append("lot_type", data.lot_type);

        if (data.bedrooms !== "") fd.append("bedrooms", String(data.bedrooms));
        if (data.bathrooms !== "") fd.append("bathrooms", String(data.bathrooms));

        (data.images ?? []).forEach((f) => fd.append("images[]", f));

        router.post(route("lots.update", { lot: lot.id }), fd, {
            preserveScroll: true,
            onSuccess: () => {
                previews.forEach(URL.revokeObjectURL);
                setPreviews([]);
                setData("images", []);
            },
        });
    };

    const badIndexes = Object.keys(errors)
        .filter((k) => k.startsWith("images.") && /^\d+$/.test(k.split(".")[1]))
        .map((k) => Number(k.split(".")[1]));
    const badSet = useMemo(() => new Set(badIndexes ?? []), [badIndexes]);

    const { props } = usePage<{ errors: Record<string, string> }>();
    const serverErrors = props.errors ?? {};
    const existingBlockErrors = Object.values(serverErrors).filter(msg =>
        msg.includes("удалить") || msg.includes("delete")
    );

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={`${lot.name} • edit`} />

            <div className="container mx-auto max-w-screen-md px-4">
                <PageHeader
                    title={`Edit ${lot.name}`}
                    subtitle="Update lot details or manage images"
                    right={<BackButton />}
                />

                <form onSubmit={submit} className="space-y-8">
                    <LotForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        enums={enums}
                        previews={previews}
                        onFilesChange={onFilesChange}
                        badSet={badSet}
                    />

                    <div className="space-y-4 pt-4 border-t">
                        <h2 className="text-lg font-medium">Existing images</h2>
                        <ExistingImagesGrid
                            lotId={lot.id}
                            images={lot.images ?? []}
                            errorMessages={existingBlockErrors}
                        />
                    </div>

                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                        <div className="mb-3 text-sm font-medium text-destructive">Danger zone</div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                Permanently delete this lot and all its images.
                            </div>
                            <div className="flex items-center gap-2">
                                <DeleteLotButton lotId={lot.id} lotName={lot.name} />
                            </div>
                        </div>
                    </div>

                    <FormActions
                        backHref={route("lots.view", { lot: lot.id })}
                        processing={processing}
                    />
                </form>
            </div>
        </MainLayout>
    );
}
