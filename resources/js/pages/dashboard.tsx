import { Head, router } from "@inertiajs/react";
import { type PaginatedData } from "@/types";
import { LotsList } from "@/components/lots-list";
import type { Lot } from "@/types/lots";
import MainLayout from "@/layouts/main-layout";
import { pickBy } from "lodash";
import { route } from "ziggy-js";

type Props = {
    lots: PaginatedData<Lot>;
    filters: any;
};

export default function Dashboard({ lots, filters }: Props) {
    const onFilterApply = (newFilters: any) => {
        const cleanFilters = pickBy(newFilters);

        router.get(
            route("dashboard"),
            cleanFilters,
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta
                    name="description"
                    content="Discover and download the best Sims 4 lots. Filter by size, type, furnishing and more. High quality residential and community builds."
                />
            </Head>
            <MainLayout>
                <LotsList
                    lots={lots}
                    showHeader
                    showFilters
                    showCreateButton
                    title="Dashboard"
                    subtitle="Discover unique builds and inspire your next gameplay"
                    filters={filters}
                    onFilterApply={onFilterApply}
                />
            </MainLayout>
        </>
    );
}
