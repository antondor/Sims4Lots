import React, { useState } from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { Enums, FormType, Lot } from "@/types/lots";
import { route } from "ziggy-js";
import { LotFormFields } from "@/components/lots/lot-form-fields";
import { ImagesUploader } from "@/components/lots/image-uploader";
import { ExistingImagesGrid } from "@/components/lots/existing-images-grid";
import { FormActions } from "@/components/lots/form-actions";
import { DeleteLotButton } from "@/components/lots/delete-lot-button";
import { BreadcrumbItem } from "@/types";
import { BackButton } from "@/components/back-button";

export default function EditLot({ lot, enums }: { lot: Lot; enums: Enums }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: lot.name, href: route("lots.view", { lot: lot.id }) },
        { title: "Edit" },
    ];

    const initial: FormType = {
        name: lot.name ?? "",
        description: lot.description ?? "",
        creator_id: lot.creator_id ?? "",
        creator_link: lot.creator_link ?? "",
        download_link: (lot as any).download_link ?? "",
        lot_size: lot.lot_size ?? (enums.lot_sizes[0] ?? "20x15"),
        content_type: lot.content_type ?? (enums.content_types[0] ?? "NoCC"),
        furnishing: lot.furnishing ?? (enums.furnishings[0] ?? "Furnished"),
        lot_type: lot.lot_type ?? (enums.lot_types[0] ?? "Residential"),
        bedrooms: lot.bedrooms ?? "",
        bathrooms: lot.bathrooms ?? "",
        images: [],
    };

    const { data, setData, errors, processing } = useForm<FormType>(initial);
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
        fd.append("creator_id", data.creator_id ?? "");
        fd.append("creator_link", data.creator_link ?? "");
        fd.append("download_link", data.download_link ?? "");
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
            },
        });
    };

    const { props } = usePage<{ errors: Record<string, string> }>();
    const serverErrors = props.errors ?? {};
    const existingBlockErrors = [...new Set(
        Object.entries(serverErrors)
            .filter(([k]) => k === "images" || k.startsWith("images."))
            .map(([, v]) => String(v))
    )];
    const badIndexes = Object.keys(serverErrors)
        .filter((k) => k.startsWith("images.") && /^\d+$/.test(k.split(".")[1]))
        .map((k) => Number(k.split(".")[1]));

    const handleDelete = () => {
        if (!confirm(`Delete "${lot.name}"? This action cannot be undone.`)) return;
        router.delete(route("lots.destroy", { lot: lot.id }), {
            preserveScroll: true,
            onSuccess: () => {
                // редирект произойдёт из контроллера (на lots.mine), но можно и здесь:
                // router.visit(route("lots.mine"));
            },
        });
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit: ${lot.name}`} />

            <div className="container mx-auto max-w-screen-md px-4">
                <div className="flex items-center gap-3 mb-3">
                    <BackButton />
                    <h1 className="text-xl font-semibold">Edit {lot.name}</h1>
                    <span />
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <LotFormFields data={data} setData={setData} enums={enums} errors={errors as any} />

                    <ImagesUploader
                        onFilesChange={onFilesChange}
                        previews={previews}
                        badIndexes={badIndexes}
                        errors={errors as any}
                    />

                    <div className="space-y-3">
                        <h2 className="text-lg font-medium">Existing images</h2>
                        <ExistingImagesGrid
                            lotId={lot.id}
                            images={lot.images ?? []}
                            errorMessages={existingBlockErrors}
                        />
                    </div>

                    <div className="mt-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                        <div className="mb-3 text-sm font-medium text-destructive">Danger zone</div>
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                Permanently delete this lot and all its images.
                            </div>
                            <div className="flex items-center gap-2">
                                <DeleteLotButton lotId={lot.id} lotName={lot.name} />
                            </div>
                        </div>
                    </div>

                    <FormActions
                        backHref={{ name: "lots.view", params: { lot: lot.id } }}
                        processing={processing}
                    />
                </form>
            </div>
        </MainLayout>
    );
}
