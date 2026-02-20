import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { LotFilters } from "@/components/lot-filters";
import { LotCard } from "@/components/lot-card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { DefaultPagination } from "@/components/default-pagination";
import { route } from "ziggy-js";
import { Plus } from "lucide-react";
import { pickBy } from "lodash";

type Props = {
    lots: PaginatedData<Lot>;
    showHeader?: boolean;
    showFilters?: boolean;
    showCreateButton?: boolean;
    title?: string;
    subtitle?: string;
    filters?: any;
    onFilterApply?: (filters: any) => void;
};

export const LotsList: React.FC<Props> = ({
    lots,
    showHeader = false,
    showFilters = false,
    showCreateButton = false,
    title,
    subtitle,
    filters,
    onFilterApply,
}) => {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;

    const currentFilters = filters || (props as any)?.filters || {};

    const handleInternalApply = (newFilters: any) => {
        if (onFilterApply) {
            onFilterApply(newFilters);
            return;
        }

        const q: Record<string, any> = {
            sort: newFilters.sort,
            source: newFilters.source,
            lotType: newFilters.lotType,
            sizes: newFilters.sizes?.length ? newFilters.sizes : undefined,
            contentTypes: newFilters.contentTypes?.length ? newFilters.contentTypes : undefined,
            furnishings: newFilters.furnishings?.length ? newFilters.furnishings : undefined,
            bedroomsMin: newFilters.bedroomsMin || undefined,
            bedroomsMax: newFilters.bedroomsMax || undefined,
            bathroomsMin: newFilters.bathroomsMin || undefined,
            bathroomsMax: newFilters.bathroomsMax || undefined,
        };

        const cleanQuery = pickBy(q);

        router.get(route("dashboard"), cleanQuery as any, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            {showHeader && (
                <div className="mb-6 flex w-full items-center justify-between gap-4 flex-wrap">
                    <div className="w-full md:w-auto">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {title || "Dashboard"}
                        </h1>
                        {subtitle && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex w-full md:w-auto items-center justify-end gap-2">
                        {showFilters && (
                            <div className={showCreateButton && user ? "flex-1 md:w-auto [&_button]:w-full" : "w-full md:w-auto [&_button]:w-full"}>
                                <LotFilters
                                    onApply={handleInternalApply}
                                    initialFilters={currentFilters}
                                />
                            </div>
                        )}

                        {showCreateButton && user && (
                            <Button asChild size="sm" className="w-[75%] md:w-auto justify-center">
                                <Link href={route("lots.create")}>
                                    <Plus className="h-4 w-4" />
                                    Create new
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {lots.data.length === 0 ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <p className="text-muted-foreground">No lots found matching your criteria.</p>
                    {Object.keys(currentFilters).length > 0 && (
                        <Button
                            variant="link"
                            onClick={() => router.get(route("dashboard"))}
                            className="mt-2"
                        >
                            Clear all filters
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                        {lots.data.map((lot) => (
                            <div key={lot.id} className="min-w-0">
                                <LotCard lot={lot} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <DefaultPagination data={lots} />
                    </div>
                </>
            )}
        </>
    );
};
