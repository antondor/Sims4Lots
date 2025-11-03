import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
    href?: string | null;
    size?: "sm" | "default" | "lg" | "icon";
    className?: string;
};

export function LotDownloadButton({ href, size = "default", className }: Props) {
    if (!href) return null;

    const safeHref = String(href).trim();
    if (safeHref.length === 0) return null;

    return (
        <a
            href={safeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
            aria-label="Download lot"
            title="Download lot"
        >
            <Button
                size={size}
                className={["gap-2", className].filter(Boolean).join(" ")}
            >
                <Download className="h-4 w-4" />
                Download
            </Button>
        </a>
    );
}
