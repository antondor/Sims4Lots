import React from "react";
import { Head } from "@inertiajs/react";
import { type PaginatedData } from "@/types";
import { LotsList } from "@/components/lots-list";
import type { Lot } from "@/types/lots";
import MainLayout from "@/layouts/main-layout";

export default function Dashboard({ lots }: { lots: PaginatedData<Lot> }) {
    return (
        <>
            <Head title="Dashboard" />
            <MainLayout>
                <LotsList lots={lots} showHeader showFilters showCreateButton />
            </MainLayout>
        </>
    );
}
