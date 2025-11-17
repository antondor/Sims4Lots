import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import { IMAGE_PLACEHOLDER } from "@/lib";
import { BreadcrumbItem } from "@/types";

export default function AdminLotsPending({ lots }: { lots: PaginatedData<Lot> }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "Admin" },
        { title: "Pending lots" },
    ];

    const approve = (id: number) =>
        router.post(route("admin.lots.approve", { lot: id }), {}, { preserveScroll: true });

    const invalidate = (id: number) =>
        router.post(route("admin.lots.invalidate", { lot: id }), {}, { preserveScroll: true });

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
                                <CardContent className="space-y-3 p-3">
                                    <Link
                                        href={route("lots.view", { lot: lot.id })}
                                        className="group block"
                                        aria-label={`Open ${lot.name}`}
                                    >
                                        <div className="aspect-[16/9] overflow-hidden rounded-lg border bg-muted">
                                            <img
                                                src={lot.cover_image?.url ?? IMAGE_PLACEHOLDER}
                                                className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                                                loading="lazy"
                                                alt={lot.name}
                                            />
                                        </div>
                                    </Link>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

                                        <div className="flex flex-wrap justify-start gap-2 sm:justify-end">
                                            <Link href={route("lots.view", { lot: lot.id })}>
                                                <Button size="sm" variant="outline">
                                                    Open
                                                </Button>
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
