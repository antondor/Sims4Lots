import { LotFilters } from "@/components/lot-filters";
import {LotCard} from "@/components/lot-card";
import {PaginatedData} from "@/types";
import {Lot} from "@/types/lots";
import {DefaultPagination} from "@/components/default-pagination";

export const LotsList = ({ lots }: { lots: PaginatedData<Lot> }) => {
    const handleApplyFilters = (filters: any) => {
        console.log("Filters applied:", filters);
    };

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h2 className="mt-2 flex flex-col">
                    <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Lot Gallery
                    </span>
                    <span className="text-muted-foreground text-sm">
                        Browse Sims 4 builds and lots
                    </span>
                </h2>

                <LotFilters onApply={handleApplyFilters} />
            </div>

            {lots.data.length === 0 ? (
                <p className="text-center">
                    No lots created yet. Be the first to create one!
                </p>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lots.data.map((lot) => (
                            <LotCard key={lot.id} lot={lot} />
                        ))}
                    </div>

                    <DefaultPagination data={lots} />
                </>
            )}
        </>
    );
};
