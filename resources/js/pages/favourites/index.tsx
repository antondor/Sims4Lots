import { Head, Link } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { LotsList } from "@/components/lots-list";
import type { PaginatedData, BreadcrumbItem } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import { Heart, Search } from "lucide-react";

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

    return (
        <>
            <Head title={title} />
            <MainLayout breadcrumbs={breadcrumbs}>
                {!hasLots ? (
                    <div className="container mx-auto">
                        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                                <Heart className="h-10 w-10 text-muted-foreground" />
                            </div>

                            <h3 className="mt-6 text-xl font-semibold">
                                {isOwner ? "No favorites yet" : "No favorites found"}
                            </h3>

                            <p className="mb-8 mt-2 max-w-sm text-center text-sm text-muted-foreground">
                                {isOwner
                                    ? "You haven't saved any lots yet. Browse the catalog to find creations that inspire you."
                                    : `${owner.name} hasn't added any lots to their favorites yet.`
                                }
                            </p>

                            <Button asChild variant={isOwner ? "default" : "outline"}>
                                <Link href={route("dashboard")}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Explore Lots
                                </Link>
                            </Button>
                        </div>
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
