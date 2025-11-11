import * as React from "react";
import { usePage } from "@inertiajs/react";
import { toast } from "sonner";

type Flash = {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    [k: string]: unknown;
};

export function FlashToaster() {
    const { props } = usePage();
    const flash = (props as any)?.flash as Flash | undefined;

    React.useEffect(() => {
        if (!flash) return;

        if (flash.success) toast.success(String(flash.success));
        if (flash.error) toast.error(String(flash.error));
        if (flash.warning) toast.warning(String(flash.warning));
        if (flash.info) toast(String(flash.info));
    }, [flash?.success, flash?.error, flash?.warning, flash?.info]);

    return null;
}
