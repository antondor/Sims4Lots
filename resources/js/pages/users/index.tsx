// resources/js/pages/users/index.tsx
import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { route } from "ziggy-js";
import { toast } from "sonner";
import dayjs from "dayjs";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Home", href: route("dashboard") },
    { title: "Users" },
];

function UsersSearchPage() {
    const [q, setQ] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [results, setResults] = React.useState<any[]>([]);
    const abortRef = React.useRef<AbortController | null>(null);
    const timerRef = React.useRef<number | null>(null);

    const runSearch = React.useCallback(async (term: string) => {
        const value = term.trim();
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        if (value.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const url = route("users.search", { q: value });
            const res = await fetch(url, {
                headers: { "X-Requested-With": "XMLHttpRequest" },
                signal: abortRef.current.signal,
            });
            if (!res.ok) throw new Error("Search failed");
            const json = await res.json();
            setResults(Array.isArray(json?.data) ? json.data : []);
        } catch (e) {
            if ((e as any)?.name !== "AbortError") toast.error("Search error");
        } finally {
            setLoading(false);
        }
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQ(value);
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => runSearch(value), 300) as unknown as number;
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        runSearch(q);
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Find users" />

            <div className="container mx-auto max-w-screen-sm px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold tracking-tight">Find users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Search for creators by name and discover new builds to follow!
                    </p>
                </div>
                <Input
                    value={q}
                    onChange={onChange}
                    placeholder="Start typing a name…"
                    aria-label="Search users by name"
                    autoFocus
                    className="w-full"
                />

                {q.trim() && (
                    <div className="mt-6">
                        {loading ? (
                            <div className="space-y-2">
                                <RowSkeleton />
                                <RowSkeleton />
                                <RowSkeleton />
                            </div>
                        ) : results.length === 0 ? (
                            <Card>
                                <CardContent className="text-sm text-muted-foreground">
                                    No users found for “{q.trim()}”
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="divide-y rounded-lg border">
                                {results.map((u) => (
                                    <Link
                                        key={u.id}
                                        href={route("users.show", { user: u.id })}
                                        className="flex items-center gap-3 p-3 hover:bg-accent"
                                    >
                                        <img
                                            src={u.avatar_url || "/images/profile_avatar_placeholder.png"}
                                            alt={u.name}
                                            className="h-10 w-10 rounded-full object-cover ring-1 ring-border"
                                            loading="lazy"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{u.name}</div>
                                            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                                                {u.about ? u.about : "No bio yet"}
                                            </div>
                                        </div>
                                        {u.created_at ? (
                                            <div className="hidden text-xs text-muted-foreground sm:block">
                                                Joined {dayjs(u.created_at).format("MMM D, YYYY")}
                                            </div>
                                        ) : null}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

export default UsersSearchPage;

function RowSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-lg border p-3">
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
            <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-40 animate-pulse rounded bg-muted" />
                <div className="h-3 w-64 animate-pulse rounded bg-muted" />
            </div>
            <div className="hidden h-3 w-28 animate-pulse rounded bg-muted sm:block" />
        </div>
    );
}
