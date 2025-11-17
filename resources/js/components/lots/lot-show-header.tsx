import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { route } from "ziggy-js";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import { LotDownloadButton } from "@/components/lots/lot-download-button";
import type { Lot } from "@/types/lots";

type Props = {
    lot: Lot;
    isOwner: boolean;
    canModerate: boolean;
    isPendingForCurrentUser: boolean;
    onApprove: () => void;
    onReject: () => void;
    initialLiked: boolean;
    initialCount: number;
};

export const LotShowHeader: React.FC<Props> = ({
                                                   lot,
                                                   isOwner,
                                                   canModerate,
                                                   isPendingForCurrentUser,
                                                   onApprove,
                                                   onReject,
                                                   initialLiked,
                                                   initialCount,
                                               }) => {
    return (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold">{lot.name}</h1>

                {isPendingForCurrentUser && (
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                        Awaiting approve
                    </span>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-start gap-2 md:justify-end">
                {canModerate && lot.status === "pending" && (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={onApprove}>Approve</Button>
                        <Button variant="destructive" onClick={onReject}>
                            Reject
                        </Button>
                    </div>
                )}

                <FavouriteToggle
                    lotId={lot.id}
                    initialLiked={initialLiked}
                    initialCount={initialCount}
                    size="md"
                    showCount
                />

                <LotDownloadButton href={lot.download_link} />

                {isOwner && (
                    <Link href={route("lots.edit", lot.id)}>
                        <Button
                            variant="secondary"
                            className="gap-2 transition-[filter,opacity] hover:opacity-90 hover:brightness-95"
                            title="Edit this lot"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                )}

                <Link href={route("dashboard")}>
                    <Button variant="outline">Back</Button>
                </Link>
            </div>
        </div>
    );
};
