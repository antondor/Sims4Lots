import React, { useMemo, useState, useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { PageHeader } from "@/components/upload-form/page-header";
import { BreadcrumbItem } from "@/types";
import { BackButton } from "@/components/back-button";
import { LotForm } from "@/components/lots/lot-form";

type Enums = {
    lot_sizes: string[];
    content_types: string[];
    furnishings: string[];
    lot_types: string[];
};

export default function CreateLot({ enums }: { enums: Enums }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "Create new lot" },
    ];

    const { data, setData, post, processing, errors, reset } = useForm<{
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
        images: File[];
    }>({
        name: "",
        description: "",
        creator_link: "",
        download_link: "",
        gallery_id: "",
        lot_size: enums.lot_sizes[0] ?? "20x15",
        content_type: enums.content_types[0] ?? "NoCC",
        furnishing: enums.furnishings[0] ?? "Furnished",
        lot_type: enums.lot_types[0] ?? "Residential",
        bedrooms: "",
        bathrooms: "",
        images: [],
    });

    const [previews, setPreviews] = useState<string[]>([]);
    const isCommunity = data.lot_type === "Community";

    useEffect(() => {
        if (isCommunity) {
            setData("bedrooms", "");
            setData("bathrooms", "");
        }
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
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Create new" />
            <div className="container mx-auto max-w-screen-md px-4">
                <PageHeader
                    title="Create new lot"
                    subtitle="Fill the form to publish your Sims 4 lot"
                    right={
                        <BackButton />
                    }
                />

                <form onSubmit={submit} className="space-y-6">
                    <LotForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        enums={enums}
                        previews={previews}
                        onFilesChange={onFilesChange}
                        badSet={badSet}
                    />

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
