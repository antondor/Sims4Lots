import React from "react";
import { usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { cn } from "@/lib/utils";

type PageProps = {
    navigation?: {
        intended_url?: string | null;
        previous_url?: string | null;
    };
};

type BackButtonProps = {
    className?: string;
    fallbackHref?: string;
    children?: React.ReactNode;
};

export function BackButton({
    className,
    fallbackHref = route("dashboard"),
    children = "Back",
}: BackButtonProps) {
    const { props } = usePage<PageProps>();

    const resolvedHref = React.useMemo(() => {
        const currentUrl = typeof window !== "undefined" ? window.location.href : null;
        const candidates = [props.navigation?.intended_url, props.navigation?.previous_url, fallbackHref];

        return (
            candidates.find((href) => href && href !== currentUrl) ?? fallbackHref
        );
    }, [props.navigation?.intended_url, props.navigation?.previous_url, fallbackHref]);

    const handleClick = React.useCallback(() => {
        window.location.href = resolvedHref;
    }, [resolvedHref]);

    return (
        <Button
            type="button"
            variant="outline"
            className={cn("gap-2", className)}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}
