import * as React from "react";
import { router } from "@inertiajs/react";

export function useToggleFavourite(initialLiked: boolean, url: string, initialCount = 0) {
    const [liked, setLiked] = React.useState(initialLiked);
    const [busy, setBusy] = React.useState(false);
    const [count, setCount] = React.useState<number>(initialCount);

    React.useEffect(() => { setLiked(initialLiked); }, [initialLiked]);
    React.useEffect(() => { setCount(initialCount); }, [initialCount]);

    const toggle = React.useCallback(() => {
        if (busy || !url) return;
        const next = !liked;
        const delta = next ? 1 : -1;

        setLiked(next);
        setCount((c) => Math.max(0, c + delta));
        setBusy(true);

        router.post(url, {}, {
            preserveScroll: true,
            onError: () => {
                setLiked(!next);
                setCount((c) => Math.max(0, c - delta));
            },
            onFinish: () => setBusy(false),
        });
    }, [busy, liked, url]);

    return { liked, busy, count, toggle };
}
