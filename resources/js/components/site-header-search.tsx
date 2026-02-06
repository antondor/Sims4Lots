import React from "react";
import { Input } from "@/components/ui/input";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { useDebounced } from "@/hooks/use-debounced";
import { useAbortableFetch } from "@/hooks/use-abortable-fetch";
// Добавляем иконку
import { ShieldCheck } from "lucide-react";

type LotResult = {
    id: number;
    name: string;
    cover_url: string;
};

type UserResult = {
    id: number;
    name: string;
    avatar_url: string;
    is_online: boolean;
    // Добавляем поле в тип
    is_admin?: number | boolean;
};

type SearchData = {
    users: UserResult[];
    lots: LotResult[];
};

export function SiteHeaderSearch() {
    const [q, setQ] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState<SearchData>({ users: [], lots: [] });

    const debounced = useDebounced(q, 250);
    const run = useAbortableFetch();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQ(e.target.value);
    };

    const onBlur = () => {
        setTimeout(() => setOpen(false), 200);
    };

    React.useEffect(() => {
        const value = debounced.trim();
        if (value.length < 2) {
            setData({ users: [], lots: [] });
            setOpen(false);
            return;
        }

        let mounted = true;
        setLoading(true);

        run(route("header.search", { q: value }), {
            headers: { "X-Requested-With": "XMLHttpRequest" },
        })
            .then(async ({ res, aborted }) => {
                if (aborted || !mounted) return;
                const json = await res.json();
                setData({
                    users: json.users || [],
                    lots: json.lots || []
                });
                setOpen(true);
            })
            .catch(() => {
                if (mounted) {
                    setData({ users: [], lots: [] });
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

    const hasResults = data.users.length > 0 || data.lots.length > 0;

    return (
        <div className="relative w-full max-w-sm">
            <Input
                value={q}
                onChange={onChange}
                onFocus={() => q.trim().length >= 2 && hasResults && setOpen(true)}
                onBlur={onBlur}
                placeholder="Search..."
                className="w-full"
            />

            {open && (
                <div className="absolute left-0 right-0 z-50 mt-2 max-h-[80vh] overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">

                    {loading && (
                        <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
                    )}

                    {!loading && !hasResults && (
                        <div className="px-4 py-3 text-sm text-muted-foreground">No results found.</div>
                    )}

                    {!loading && hasResults && (
                        <div className="py-2">

                            {data.users.length > 0 && (
                                <>
                                    <h4 className="mb-1 px-3 text-xs font-semibold text-muted-foreground">Users</h4>
                                    <ul className="mb-2">
                                        {data.users.map((user) => (
                                            <li key={`u-${user.id}`}>
                                                <Link
                                                    href={route("users.show", { user: user.id })}
                                                    className="flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <img
                                                        src={user.avatar_url}
                                                        alt={user.name}
                                                        className="h-8 w-8 rounded-full object-cover border"
                                                    />
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-medium leading-none">{user.name}</span>
                                                            {user.is_admin && (
                                                                <ShieldCheck className="h-3 w-3 text-red-500" />
                                                            )}
                                                        </div>
                                                        {user.is_online && <span className="text-[10px] text-green-500">Online</span>}
                                                    </div>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {data.users.length > 0 && data.lots.length > 0 && (
                                <div className="my-2 h-px bg-border" />
                            )}

                            {data.lots.length > 0 && (
                                <>
                                    <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Lots</h4>
                                    <ul className="space-y-1 px-2">
                                        {data.lots.map((lot) => (
                                            <li key={`l-${lot.id}`}>
                                                <Link
                                                    href={route("lots.view", { lot: lot.id })}
                                                    onClick={() => setOpen(false)}
                                                    className="group relative flex h-14 w-full items-center overflow-hidden rounded-md px-4 transition-all hover:scale-[1.008] hover:shadow-sm"
                                                >
                                                    <img
                                                        src={lot.cover_url}
                                                        alt=""
                                                        className="absolute inset-0 h-full w-full object-cover blur-[1px] brightness-[0.4]"
                                                        loading="lazy"
                                                    />

                                                    <span className="relative z-10 truncate text-white/85">
                                                        {lot.name}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
