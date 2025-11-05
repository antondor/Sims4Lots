import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useDebounced } from "@/hooks/use-debounced";
import { useAbortableFetch } from "@/hooks/use-abortable-fetch";

type Result = { id: number; name: string; cover_url: string };

export function SidebarSearch() {
    const [q, setQ] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<Result[]>([]);

    const debounced = useDebounced(q, 250);
    const run = useAbortableFetch();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
    };

    const onBlur = () => {
        setTimeout(() => setOpen(false), 120);
    };

    React.useEffect(() => {
        const value = debounced.trim();
        if (value.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }

        let mounted = true;
        setLoading(true);

        run(route("lots.search", { q: value }), {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then(async ({ res, aborted }) => {
                if (aborted || !mounted) return;
                const json = await res.json();
                setResults(json?.data ?? []);
                setOpen(true);
            })
            .catch(() => {
                if (mounted) {
                    setResults([]);
                    setOpen(false);
                }
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [debounced, run]);

    return (
        <div className="relative">
            <Input
                value={q}
                onChange={onChange}
                onFocus={() => q.trim().length >= 2 && results.length > 0 && setOpen(true)}
                onBlur={onBlur}
                placeholder="Search..."
            />

            {open && (
                <div className="absolute left-0 right-0 z-50 mt-2 max-h-80 overflow-auto rounded-md border bg-background shadow">
                    {loading && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">Searching…</div>
                    )}
                    {!loading && results.length === 0 && (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No results</div>
                    )}
                    {!loading && results.length > 0 && (
                        <ul className="py-1">
                            {results.map((r) => (
                                <li key={r.id}>
                                    <Link
                                        href={route("lots.view", { lot: r.id })}
                                        className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-accent"
                                    >
                                        <img
                                            src={r.cover_url}
                                            alt=""
                                            className="h-8 w-12 rounded object-cover"
                                            loading="lazy"
                                        />
                                        <span className="line-clamp-1">{r.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
