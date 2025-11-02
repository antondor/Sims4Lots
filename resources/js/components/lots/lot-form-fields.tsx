import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Enums, FormType } from "@/types/lots";

type Props = {
    data: FormType;
    setData: <K extends keyof FormType>(key: K, value: FormType[K]) => void;
    enums: Enums;
    errors: Record<string, string>;
};

export function LotFormFields({ data, setData, enums, errors }: Props) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <Label htmlFor="name" className="mb-2">Name</Label>
                <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="sm:col-span-2">
                <Label htmlFor="description" className="mb-2">Description</Label>
                <Textarea
                    id="description"
                    value={data.description ?? ""}
                    onChange={(e) => setData("description", e.target.value)}
                    placeholder="Short description"
                />
                {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div>
                <Label htmlFor="creator_id" className="mb-2">Creator ID</Label>
                <Input
                    id="creator_id"
                    value={data.creator_id ?? ""}
                    onChange={(e) => setData("creator_id", e.target.value)}
                />
                {errors.creator_id && <p className="mt-1 text-sm text-red-500">{errors.creator_id}</p>}
            </div>

            <div>
                <Label htmlFor="creator_link" className="mb-2">Creator link</Label>
                <Input
                    id="creator_link"
                    value={data.creator_link ?? ""}
                    onChange={(e) => setData("creator_link", e.target.value)}
                    placeholder="https://example.com/gallery"
                />
                {errors.creator_link && <p className="mt-1 text-sm text-red-500">{errors.creator_link}</p>}
            </div>

            <div>
                <Label className="mb-2">Lot size</Label>
                <Select value={data.lot_size} onValueChange={(v) => setData("lot_size", v)}>
                    <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    <SelectContent>
                        {enums.lot_sizes.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.lot_size && <p className="mt-1 text-sm text-red-500">{errors.lot_size}</p>}
            </div>

            <div>
                <Label className="mb-2">Content type</Label>
                <Select value={data.content_type} onValueChange={(v) => setData("content_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select content" /></SelectTrigger>
                    <SelectContent>
                        {enums.content_types.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.content_type && <p className="mt-1 text-sm text-red-500">{errors.content_type}</p>}
            </div>

            <div>
                <Label className="mb-2">Furnishing</Label>
                <Select value={data.furnishing} onValueChange={(v) => setData("furnishing", v)}>
                    <SelectTrigger><SelectValue placeholder="Select furnishing" /></SelectTrigger>
                    <SelectContent>
                        {enums.furnishings.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.furnishing && <p className="mt-1 text-sm text-red-500">{errors.furnishing}</p>}
            </div>

            <div>
                <Label className="mb-2">Lot type</Label>
                <Select value={data.lot_type} onValueChange={(v) => setData("lot_type", v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                        {enums.lot_types.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.lot_type && <p className="mt-1 text-sm text-red-500">{errors.lot_type}</p>}
            </div>

            <div>
                <Label htmlFor="bedrooms" className="mb-2">Bedrooms</Label>
                <Input
                    id="bedrooms"
                    type="number"
                    min={0}
                    value={String(data.bedrooms)}
                    onChange={(e) => setData("bedrooms", e.target.value)}
                />
                {errors.bedrooms && <p className="mt-1 text-sm text-red-500">{errors.bedrooms}</p>}
            </div>

            <div>
                <Label htmlFor="bathrooms" className="mb-2">Bathrooms</Label>
                <Input
                    id="bathrooms"
                    type="number"
                    min={0}
                    value={String(data.bathrooms)}
                    onChange={(e) => setData("bathrooms", e.target.value)}
                />
                {errors.bathrooms && <p className="mt-1 text-sm text-red-500">{errors.bathrooms}</p>}
            </div>
        </div>
    );
}
