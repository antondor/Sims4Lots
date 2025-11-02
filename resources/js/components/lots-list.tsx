import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { LotFilters } from "@/components/lot-filters";
import { LotCard } from "@/components/lot-card";
import { PaginatedData } from "@/types";
import { Lot } from "@/types/lots";
import { DefaultPagination } from "@/components/default-pagination";
import {route} from "ziggy-js";

export const LotsList = ({ lots }: { lots: PaginatedData<Lot> }) => {
    const handleApplyFilters = (filters: any) => {
        console.log("Filters applied:", filters);
    };

    return (
        <>
            <div className="mb-5 flex w-full items-end justify-between gap-4">
                <h2 className="mt-2 min-w-0">
          <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
            Lot Gallery
          </span>
                    <span className="text-muted-foreground block text-sm">
            Browse Sims 4 builds and lots
          </span>
                </h2>

                <div className="flex items-center gap-2 shrink-0 self-start">
                    <Link href={route("lots.create")} className="inline-flex">
                        <Button size="sm">Create lot</Button>
                    </Link>
                    <LotFilters onApply={handleApplyFilters} />
                </div>
            </div>

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
