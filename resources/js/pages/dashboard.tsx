import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import {LotsList} from "@/components/lots-list";
import {PaginatedData} from "@/types";
import {Lot} from "@/types/lots";

export default function Dashboard({ lots }: { lots: PaginatedData<Lot> }) {
    return (
        <MainLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col">
                <LotsList lots={lots} />
            </div>
        </MainLayout>
    );
}
