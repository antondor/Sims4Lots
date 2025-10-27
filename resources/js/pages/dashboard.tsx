import React from "react";
import { Head } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import {DashboardList} from "@/components/dashboard-list";

export default function Dashboard() {
    return (
        <MainLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col px-4 py-8">
                <DashboardList />
            </div>
        </MainLayout>
    );
}
