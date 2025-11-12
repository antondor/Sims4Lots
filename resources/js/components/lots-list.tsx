import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { LotFilters } from "@/components/lot-filters";
import { LotCard } from "@/components/lot-card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { DefaultPagination } from "@/components/default-pagination";
import { route } from "ziggy-js";

type Props = {
    lots: PaginatedData<Lot>;
    showHeader?: boolean;
    showFilters?: boolean;
    showCreateButton?: boolean;
    title?: string;
    subtitle?: string;
};

export const LotsList: React.FC<Props> = ({
                                              lots,
                                              showHeader = false,
                                              showFilters = false,
                                              showCreateButton = false,
                                          }) => {
    const handleApplyFilters = (filters: any) => {
        const q: Record<string, any> = {
            lotType: filters.lotType,
            sizes: filters.sizes?.length ? filters.sizes : undefined,
            contentTypes: filters.contentTypes?.length ? filters.contentTypes : undefined,
            furnishings: filters.furnishings?.length ? filters.furnishings : undefined,
            bedroomsMin: filters.bedroomsMin || undefined,
            bedroomsMax: filters.bedroomsMax || undefined,
            bathroomsMin: filters.bathroomsMin || undefined,
            bathroomsMax: filters.bathroomsMax || undefined,
        };

        router.get(route("dashboard"), q, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const { props } = usePage();
    const user = (props as any)?.auth?.user;

    return (
        <>
            {showHeader && (
                <div className="mb-5 flex w-full items-end justify-end gap-4">
                    {(showCreateButton || showFilters) && (
                        <div className="flex items-center gap-2 shrink-0 self-start">
                            {showCreateButton && user && (
                                <Link href={route("lots.create")} className="inline-flex">
                                    <Button size="sm">Create lot</Button>
                                </Link>
                            )}
                            {showFilters && <LotFilters onApply={handleApplyFilters} />}
                        </div>
                    )}
                </div>
            )}

            {lots.data.length === 0 ? (
                <p className="text-center">No lots created yet. Be the first to create one!</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lots.data.map((lot) => (
                            <div key={lot.id} className="min-w-0">
                                <LotCard lot={lot} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <DefaultPagination data={lots} />
                    </div>
                </>
            )}
        </>
    );
};
