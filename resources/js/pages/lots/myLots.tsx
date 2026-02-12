import MainLayout from "@/layouts/main-layout";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, PackageOpen, Plus } from "lucide-react";
import { DefaultPagination } from "@/components/default-pagination";
import { LotCard } from "@/components/lot-card";
import type { PaginatedData } from "@/types";
import type { Lot } from "@/types/lots";
import { route } from "ziggy-js";
import { BreadcrumbItem } from "@/types";

type Props = {
    lots: PaginatedData<Lot>;
    pendingCount: number;
};

export default function LotsMine({ lots, pendingCount }: Props) {
    return (
        <MainLayout>
            <Head title="My lots" />
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        My lots
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage your uploaded creations
                    </p>
                </div>

                {lots.data.length > 0 && (
                    <Button asChild size="sm">
                        <Link href={route("lots.create")}>
                            <Plus className="h-4 w-4" />
                            Create new
                        </Link>
                    </Button>
                )}
            </div>

            {pendingCount > 0 && (
                <Alert className="mb-6">
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
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <PackageOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">No lots created</h3>
                    <p className="mb-8 mt-2 max-w-sm text-center text-sm text-muted-foreground">
                        You haven't uploaded any lots yet. Start building your collection and share your creations with the world.
                    </p>
                    <Button asChild>
                        <Link href={route('lots.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create your first Lot
                        </Link>
                    </Button>
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
        </MainLayout>
    );
}