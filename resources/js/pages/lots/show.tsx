import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import type { Lot } from "@/types/lots";
import { toast } from "sonner";
import { route } from "ziggy-js";
import { BreadcrumbItem } from "@/types";

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
    const { lot, isOwner, pendingIds } = props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: lot.name },
    ];

    const { isAdmin } = (usePage().props as unknown as PageProps);

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

    const reject = () => {
        router.post(
            route("admin.lots.invalidate", lot.id),
            {},
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

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={lot.name} />

            <div className="container mx-auto max-w-screen-xl px-4">
                <LotShowHeader
                    lot={lot}
                    isOwner={isOwner}
                    canModerate={canModerate}
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
