import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import { LotData } from "@/components/lots/lot-form";

type Props = {
    data: LotData;
    setData: (key: any, value: any) => void;
    errors: Record<string, string>;
};

export function DownloadSourceSelector({ data, setData, errors }: Props) {
    const [method, setMethod] = useState<"link" | "gallery">(
        data.gallery_id ? "gallery" : "link"
    );

    return (
        <div className="space-y-4 rounded-lg border p-4 bg-muted/20">
            <Label>Download Source</Label>

            <Tabs value={method} onValueChange={(v) => setMethod(v as "link" | "gallery")} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="link">Direct Link</TabsTrigger>
                    <TabsTrigger value="gallery">EA Gallery ID</TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="mt-4 space-y-2">
                    <Label htmlFor="download_link">Download Link URL</Label>
                    <Input
                        id="download_link"
                        placeholder="https://simfileshare.net/..."
                        value={data.download_link ?? ""}
                        onChange={(e) => setData("download_link", e.target.value)}
                        inputMode="url"
                    />
                    <p className="text-xs text-muted-foreground">
                        Provide a direct link to the file.
                    </p>
                    {errors.download_link && (
                        <div className="text-sm text-destructive">{errors.download_link}</div>
                    )}
                </TabsContent>

                <TabsContent value="gallery" className="mt-4 space-y-2">
                    <Label htmlFor="gallery_id">Gallery ID (Item Name or Origin ID)</Label>
                    <Input
                        id="gallery_id"
                        placeholder="Example: USERID123 or LotName"
                        value={data.gallery_id ?? ""}
                        onChange={(e) => setData("gallery_id", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                        Users will be able to copy this ID to search in the game.
                    </p>
                    {errors.gallery_id && (
                        <div className="text-sm text-destructive">{errors.gallery_id}</div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
