import * as React from "react";
import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DefaultPagination } from "@/components/default-pagination";
import { LotCard } from "@/components/lot-card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import {route} from "ziggy-js";
import {PageHeader} from "@/components/page-header";
import {BreadcrumbItem} from "@/types";

type Props = {
    lots: PaginatedData<Lot>;
    pendingCount: number;
};

export default function LotsMine({ lots, pendingCount }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "My lots" },
    ];

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="My lots" />
            <div className="container mx-auto">
                {pendingCount > 0 && (
                    <Alert className="mb-4">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Under review</AlertTitle>
                        <AlertDescription>
                            {pendingCount === 1
                                ? "You have 1 lot awaiting moderation. It isn’t public yet, but you can view and edit it here"
                                : `You have ${pendingCount} lots awaiting moderation. They aren’t public yet, but you can view and edit them here`}
                        </AlertDescription>
                    </Alert>
                )}

                {lots.data.length === 0 ? (
                    <Card>
                        <CardContent className="p-6 text-sm text-muted-foreground">
                            You haven’t created any lots yet.
                        </CardContent>
                    </Card>
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
            </div>
        </MainLayout>
    );
}
