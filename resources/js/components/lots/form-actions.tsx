import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

type Props = {
    backHref: string | { name: string; params?: Record<string, any> };
    processing?: boolean;
};

export function FormActions({ backHref, processing }: Props) {
    const href = typeof backHref === "string" ? backHref : route(backHref.name, backHref.params ?? {});
    return (
        <div className="flex items-center justify-end gap-3">
            <Link href={href} className="inline-flex">
                <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={processing}>Save changes</Button>
        </div>
    );
}
