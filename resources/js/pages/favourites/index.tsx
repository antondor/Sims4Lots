import * as React from "react";
import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { LotsList } from "@/components/lots-list";
import type { PaginatedData, BreadcrumbItem } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";

type Owner = {
    id: number;
    name: string;
    avatar_url: string;
};

type Props = {
    lots: PaginatedData<Lot>;
    owner: Owner;
    isOwner: boolean;
};

export default function FavouritesIndex({ lots, owner, isOwner }: Props) {
    const hasLots = lots.data.length > 0;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        isOwner
            ? { title: "Favourites" }
            : { title: `${owner.name}'s favourites` },
    ];

    const title = isOwner ? "Favourites" : `${owner.name} — Favourites`;

    const emptyText = isOwner
        ? "You don’t have any favourites yet."
        : "This user doesn’t have any favourites yet.";

    return (
        <>
            <Head title={title} />
            <MainLayout breadcrumbs={breadcrumbs}>
                {!hasLots ? (
                    <div className="rounded-lg border p-8 text-center">
                        <p className="mb-4 text-muted-foreground">{emptyText}</p>
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
