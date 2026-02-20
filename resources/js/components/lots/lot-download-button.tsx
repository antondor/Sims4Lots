import * as React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Props = {
    href?: string | null;
    size?: "sm" | "default" | "lg" | "icon";
    className?: string;
    onClick?: () => void;
    downloadsCount?: number;
};

export function LotDownloadButton({ href, size = "default", className, onClick, downloadsCount }: Props) {
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
            onClick={onClick}
        >
            <Button
                size={size}
                className={["gap-2", className].filter(Boolean).join(" ")}
            >
                <Download className="h-4 w-4" />
                Download {downloadsCount !== undefined && `(${downloadsCount})`}
            </Button>
        </a>
    );
}