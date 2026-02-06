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
import { LotDetailsAside } from "@/components/lots/lot-details-aside";

type PageProps = {
    lot: Lot;
    isOwner: boolean;
    isFavorited: boolean;
    isAdmin: boolean;
    pendingIds: number[];
};

export default function LotShow(props: PageProps) {
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

            <div className="container mx-auto max-w-screen-xl px-4 py-4 md:py-8">
                {showStatusAlert && (
                    <Alert variant={isPending ? "default" : "destructive"} className="mb-6">
                        {isPending ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <ShieldX className="h-4 w-4" />
                        )}
                        <AlertTitle>{isPending ? "Awaiting approval" : "Lot not approved"}</AlertTitle>
                        <AlertDescription>
                            {isPending
                                ? "This lot is waiting for moderation"
                                : "Unfortunately, the moderation has rejected this lot"}

                            {lot.rejection_reason && (
                                <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm leading-relaxed text-destructive">
                                    <p className="font-medium">Rejection reason</p>
                                    <p className="whitespace-pre-wrap text-destructive/90">{lot.rejection_reason}</p>
                                </div>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6 md:space-y-8">
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

                    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted border shadow-sm">
                        <LotImagesCard
                            lotName={lot.name}
                            images={images}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
                        <div className="order-2 space-y-6 lg:order-1 lg:col-span-2">
                            <LotMainInfo lot={lot} />
                        </div>

                        <div className="order-1 lg:order-2 lg:col-span-1">
                            <div className="sticky top-20 space-y-6">
                                <LotDetailsAside lot={lot} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
