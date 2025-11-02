import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";

type Result = { id: number; name: string; cover_url: string };

export function SidebarSearch() {
    const [q, setQ] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<Result[]>([]);
    const timer = React.useRef<number | null>(null);

    const doSearch = React.useCallback(async (value: string) => {
        if (value.trim().length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        try {
            const url = route("lots.search", { q: value });
            const res = await fetch(url, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
            });
            const json = await res.json();
            setResults(json?.data ?? []);
            setOpen(true);
        } catch {
            setResults([]);
            setOpen(false);
        } finally {
            setLoading(false);
        }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQ(value);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => doSearch(value), 250) as unknown as number;
    };

    const onBlur = () => {
        // чуть отложим, чтобы клик по ссылке успел сработать
        setTimeout(() => setOpen(false), 120);
    };

    return (
        <div className="relative">
            <Input
                value={q}
                onChange={onChange}
                onFocus={() => q.trim().length >= 2 && results.length > 0 && setOpen(true)}
                onBlur={onBlur}
                placeholder="Search lots..."
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
