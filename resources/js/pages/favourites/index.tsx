import React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { LotsList } from "@/components/lots-list";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import {PageHeader} from "@/components/page-header";

export default function FavouritesIndex({ lots }: { lots: PaginatedData<Lot> }) {
    return (
        <MainLayout>
            <Head title="Favourites" />
            <PageHeader
                breadcrumbs={[
                    { title: "Home", href: route("dashboard") },
                    { title: "Favourites" },
                ]}
                title="Favourites"
            />
            <div className="container mx-auto px-4 py-8">
                {lots.data.length === 0 ? (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="mb-4 text-muted-foreground">You don’t have any favourites yet.</p>
                        <Link href={route("dashboard")}>
                            <Button variant="outline">Browse lots</Button>
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
