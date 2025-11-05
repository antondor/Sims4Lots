import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { LotsList } from "@/components/lots-list";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";

export default function MyLots({ lots }: { lots: PaginatedData<Lot> }) {
    return (
        <MainLayout>
            <Head title="My lots" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-semibold">My lots</h1>
                        <p className="text-sm text-muted-foreground">All lots you’ve created</p>
                    </div>
                    <Link href={route("lots.create")}>
                        <Button>Create lot</Button>
                    </Link>
                </div>

                {lots.data.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="mb-4 text-muted-foreground">You haven’t created any lots yet.</p>
                        <Link href={route("lots.create")}>
                            <Button>Create your first lot</Button>
                        </Link>
                    </div>
                ) : (
                    <LotsList
                        lots={lots}
                        showHeader={false}
                        showFilters={false}
                        showCreateButton={false}
                    />
                )}
            </div>
        </MainLayout>
    );
}
