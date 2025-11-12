import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import {IMAGE_PLACEHOLDER, resolveSrc} from "@/lib";
import {PageHeader} from "@/components/page-header";
import {BreadcrumbItem} from "@/types";

export default function AdminLotsPending({ lots }: { lots: PaginatedData<Lot> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "Admin" },
        { title: "Pending lots" },
    ];

    const approve = (id: number) =>
        router.patch(route("admin.lots.approve", id), {}, { preserveScroll: true });
    const invalidate = (id: number) =>
        router.patch(route("admin.lots.invalidate", id), {}, { preserveScroll: true });

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Pending lots" />
            <div className="container mx-auto px-4 py-8">
                {lots.data.length === 0 ? (
                    <p className="text-muted-foreground">No pending lots.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lots.data.map((lot) => (
                            <Card key={lot.id} className="overflow-hidden">
                                <CardContent className="p-3 space-y-3">
                                    <Link
                                        href={route("lots.view", { lot: lot.id })}
                                        className="block group"
                                        aria-label={`Open ${lot.name}`}
                                    >
                                        <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
                                            <img
                                                src={lot.cover_image?.url ?? IMAGE_PLACEHOLDER}
                                                className="w-full h-full object-cover transition group-hover:scale-[1.02]"
                                                loading="lazy"
                                                alt={lot.name}
                                            />
                                        </div>
                                    </Link>

                                    <div className="flex items-center justify-between gap-3">
                                        <div className="min-w-0">
                                            <Link
                                                href={route("lots.view", { lot: lot.id })}
                                                className="truncate font-medium hover:underline"
                                            >
                                                {lot.name}
                                            </Link>
                                            <div className="text-xs text-muted-foreground">
                                                {lot.user?.name ?? "—"}
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Link href={route("lots.view", { lot: lot.id })}>
                                                <Button size="sm" variant="outline">Open</Button>
                                            </Link>
                                            <Button size="sm" variant="secondary" onClick={() => approve(lot.id)}>
                                                Approve
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => invalidate(lot.id)}>
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
