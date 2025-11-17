import React from "react";
import { Head, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import type { Lot } from "@/types/lots";
import { toast } from "sonner";
import { route } from "ziggy-js";
import { BreadcrumbItem } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ShieldX } from "lucide-react";

import { LotShowHeader } from "@/components/lots/lot-show-header";
import { LotImagesCard } from "@/components/lots/lot-images-card";
import { LotMainInfo } from "@/components/lots/lot-main-info";
import { LotAuthorAside } from "@/components/lots/lot-author-aside";
import {useIsMobile} from "@/hooks/use-mobile";

type PageProps = {
    lot: Lot;
    isOwner: boolean;
    isFavorited: boolean;
    isAdmin: boolean;
    pendingIds: number[];
};

export default function LotShow(props: PageProps) {
    const isMobile = useIsMobile();
    const { lot, isOwner, pendingIds, isAdmin } = props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: lot.name },
    ];

    const canModerate = isAdmin && lot.status !== "confirmed";

    const isPendingForCurrentUser = Array.isArray(pendingIds)
        ? pendingIds.includes(lot.id)
        : false;

    const approve = () => {
        router.post(
            route("admin.lots.approve", lot.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Lot approved"),
                onError: () => toast.error("Failed to approve lot"),
            },
        );
    };

    const reject = (reason?: string) => {
        router.post(
            route("admin.lots.invalidate", lot.id),
            { reason },
            {
                preserveScroll: true,
                onSuccess: () => toast.success("Lot rejected"),
                onError: () => toast.error("Failed to reject lot"),
            },
        );
    };

    const images = lot.images ?? [];
    const initialLiked = props.isFavorited;
    const initialCount = lot.favorites_count ?? 0;
    const showStatusAlert = lot.status !== "confirmed";
    const isPending = lot.status === "pending";

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={lot.name} />

            <div className="container mx-auto max-w-screen-xl px-4">
                {showStatusAlert && (
                    <Alert variant={isPending ? "default" : "destructive"} className="mb-4">
                        {isPending ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <ShieldX className="h-4 w-4" />
                        )}
                        <AlertTitle>{isPending ? "Awaiting approval" : "Lot not approved"}</AlertTitle>
                        <AlertDescription>
                            {isPending
                                ? "This lot is waiting for moderation. Reactions are disabled until it is approved."
                                : "Unfortunately, moderation has rejected this lot"}

                            {lot.rejection_reason && (
                                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm leading-relaxed text-destructive">
                                    <p className="font-medium">Rejection reason</p>
                                    <p className="whitespace-pre-wrap text-destructive/90">{lot.rejection_reason}</p>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                <LotShowHeader
                    lot={lot}
                    isOwner={isOwner}
                    canModerate={canModerate}
                    isAdmin={isAdmin}
                    isPendingForCurrentUser={isPendingForCurrentUser}
                    onApprove={approve}
                    onReject={reject}
                    initialLiked={initialLiked}
                    initialCount={initialCount}
                />

                <LotImagesCard
                    lotName={lot.name}
                    images={images}
                    isMobile={isMobile}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <LotMainInfo lot={lot} />
                    </div>

                    <LotAuthorAside user={lot.user} />
                </div>
            </div>
        </MainLayout>
    );
}
