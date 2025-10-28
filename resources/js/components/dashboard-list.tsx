import { LotFilters } from "@/components/lot-filters";
import {ProjectCard} from "@/components/project-card";

export const DashboardList = () => {
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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
                <ProjectCard />
            </div>
        </>
    );
};
