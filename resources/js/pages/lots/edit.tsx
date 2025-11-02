import React, { useMemo, useState } from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { router } from "@inertiajs/react";
import type { Enums, FormType, Lot } from "@/types/lots";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import {LotFormFields} from "@/components/lots/lot-form-fields";
import {ImagesUploader} from "@/components/lots/image-uploader";
import {ExistingImagesGrid} from "@/components/lots/existing-images-grid";
import {FormActions} from "@/components/lots/form-actions";
import { usePage } from "@inertiajs/react";

type PageExtras = {
    badImageIds?: number[];
    imageErrors?: string[];
};
export default function EditLot({ lot, enums }: { lot: Lot; enums: Enums }) {
    const initial: FormType = {
        name: lot.name ?? "",
        description: lot.description ?? "",
        creator_id: lot.creator_id ?? "",
        creator_link: lot.creator_link ?? "",
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

    // соберём общий список сообщений по images и images.*
    const existingBlockErrors = [...new Set(
        Object.entries(serverErrors)
            .filter(([k]) => k === "images" || k.startsWith("images."))
            .map(([, v]) => String(v))
    )];

    // индексы "плохих" новых файлов (для превью — ты уже используешь ниже)
    const badIndexes = Object.keys(serverErrors)
        .filter((k) => k.startsWith("images.") && /^\d+$/.test(k.split(".")[1]))
        .map((k) => Number(k.split(".")[1]));

    return (
        <MainLayout>
            <Head title={`Edit: ${lot.name}`} />

            <div className="container mx-auto max-w-screen-md px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <Link href={route("lots.view", { lot: lot.id })}>
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-xl font-semibold">Edit</h1>
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

                    <FormActions backHref={{ name: "lots.view", params: { lot: lot.id } }} processing={processing} />
                </form>
            </div>
        </MainLayout>
    );
}
