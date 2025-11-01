import React, {useState} from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {route} from "ziggy-js";

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
        images: File[]; // <-- файлы
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

    const onFilesChange = (files: FileList | null) => {
        const arr = files ? Array.from(files) : [];
        setData("images", arr);

        // предпросмотр
        const readers = arr.map((f) => URL.createObjectURL(f));
        setPreviews(readers);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("lots.store"), {
            forceFormData: true, // КРИТИЧНО для отправки файлов через Inertia
            onSuccess: () => {
                // очистим превью-шки
                previews.forEach((url) => URL.revokeObjectURL(url));
                reset("images");
                setPreviews([]);
            },
        });
    };

    return (
        <MainLayout>
            <Head title="Create lot" />
            <div className="container mx-auto max-w-screen-md px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold mb-2">Create new lot</h1>
                        <p className="text-muted-foreground text-sm">Fill the form to publish your Sims 4 lot</p>
                    </div>
                    <Link href={route("dashboard")}>
                        <Button variant="outline">Back</Button>
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="name" className="mb-2">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Willow Creek Cottage"
                            />
                            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="description" className="mb-2">Description</Label>
                            <Textarea
                                id="description"
                                value={data.description ?? ""}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Short description"
                            />
                            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="creator_id" className="mb-2">Creator ID</Label>
                            <Input
                                id="creator_id"
                                value={data.creator_id}
                                onChange={(e) => setData("creator_id", e.target.value)}
                                placeholder="Your Sims gallery ID"
                            />
                            {errors.creator_id && <p className="text-sm text-red-500 mt-1">{errors.creator_id}</p>}
                        </div>

                        <div>
                            <Label htmlFor="creator_link" className="mb-2">Creator link</Label>
                            <Input
                                id="creator_link"
                                value={data.creator_link ?? ""}
                                onChange={(e) => setData("creator_link", e.target.value)}
                                placeholder="https://example.com/profile"
                            />
                            {errors.creator_link && <p className="text-sm text-red-500 mt-1">{errors.creator_link}</p>}
                        </div>

                        <div>
                            <Label className="mb-2">Lot size</Label>
                            <Select
                                value={data.lot_size}
                                onValueChange={(v) => setData("lot_size", v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                                <SelectContent>
                                    {enums.lot_sizes.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lot_size && <p className="text-sm text-red-500 mt-1">{errors.lot_size}</p>}
                        </div>

                        <div>
                            <Label className="mb-2">Content type</Label>
                            <Select
                                value={data.content_type}
                                onValueChange={(v) => setData("content_type", v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select content type" /></SelectTrigger>
                                <SelectContent>
                                    {enums.content_types.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.content_type && <p className="text-sm text-red-500 mt-1">{errors.content_type}</p>}
                        </div>

                        <div>
                            <Label className="mb-2">Furnishing</Label>
                            <Select
                                value={data.furnishing}
                                onValueChange={(v) => setData("furnishing", v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                                <SelectContent>
                                    {enums.furnishings.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.furnishing && <p className="text-sm text-red-500 mt-1">{errors.furnishing}</p>}
                        </div>

                        <div>
                            <Label className="mb-2">Lot type</Label>
                            <Select
                                value={data.lot_type}
                                onValueChange={(v) => setData("lot_type", v)}
                            >
                                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                                <SelectContent>
                                    {enums.lot_types.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.lot_type && <p className="text-sm text-red-500 mt-1">{errors.lot_type}</p>}
                        </div>

                        <div>
                            <Label htmlFor="bedrooms" className="mb-2">Bedrooms</Label>
                            <Input
                                id="bedrooms"
                                type="number"
                                min={0}
                                value={data.bedrooms}
                                onChange={(e) => setData("bedrooms", e.target.value)}
                                placeholder="e.g. 3"
                            />
                            {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
                        </div>

                        <div>
                            <Label htmlFor="bathrooms" className="mb-2">Bathrooms</Label>
                            <Input
                                id="bathrooms"
                                type="number"
                                min={0}
                                value={data.bathrooms}
                                onChange={(e) => setData("bathrooms", e.target.value)}
                                placeholder="e.g. 2"
                            />
                            {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="images">Images (up to 20)</Label>
                            <Input
                                id="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => onFilesChange(e.target.files)}
                            />
                            {errors.images && <p className="text-sm text-red-500 mt-1">{errors.images}</p>}
                            {errors["images.0"] && <p className="text-sm text-red-500 mt-1">{errors["images.0"]}</p>}

                            {previews.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-3">
                                    {previews.map((src, i) => (
                                        <div key={i} className="overflow-hidden rounded-xl border">
                                            <img src={src} alt={`preview-${i}`} className="h-28 w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
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
