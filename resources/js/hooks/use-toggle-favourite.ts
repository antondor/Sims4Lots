import * as React from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";

type UseToggleFavouriteArgs = {
    url: string;
    initialLiked: boolean;
    initialCount?: number;
};

export function useToggleFavourite({ url, initialLiked, initialCount = 0 }: UseToggleFavouriteArgs) {
    const [liked, setLiked] = React.useState<boolean>(initialLiked);
    const [count, setCount] = React.useState<number>(initialCount);
    const [busy, setBusy] = React.useState<boolean>(false);

    const toggle = React.useCallback(() => {
        if (!url || busy) return;

        const nextLiked = !liked;
        const nextCount = Math.max(0, count + (nextLiked ? 1 : -1));

        setLiked(nextLiked);
        setCount(nextCount);
        setBusy(true);

        router.post(url, {}, {
            preserveScroll: true,
            onError: () => {
                setLiked(liked);
                setCount(count);
                toast.error("Could not update favourites");
            },
            onFinish: () => setBusy(false),
        });
    }, [url, busy, liked, count]);

    return { liked, count, busy, toggle };
}
