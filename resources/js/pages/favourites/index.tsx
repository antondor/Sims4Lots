import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { LotsList } from "@/components/lots-list";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import {BreadcrumbItem} from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Home", href: route("dashboard") },
    { title: "Favourites" },
];

export default function FavouritesIndex({ lots }: { lots: PaginatedData<Lot> }) {
    return (
        <>
            <Head title="Favourites" />
            <MainLayout breadcrumbs={breadcrumbs}>
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
            </MainLayout>
        </>
    );
}
