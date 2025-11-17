import React from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { route } from "ziggy-js";
import { FavouriteToggle } from "@/components/common/FavouriteToggle";
import { LotDownloadButton } from "@/components/lots/lot-download-button";
import type { Lot } from "@/types/lots";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
    lot: Lot;
    isOwner: boolean;
    canModerate: boolean;
    isAdmin: boolean;
    isPendingForCurrentUser: boolean;
    onApprove: () => void;
    onReject: (reason?: string) => void;
    initialLiked: boolean;
    initialCount: number;
};

export const LotShowHeader: React.FC<Props> = ({
                                                   lot,
                                                   isOwner,
                                                   canModerate,
                                                   isAdmin,
                                                   isPendingForCurrentUser,
                                                   onApprove,
                                                   onReject,
                                                   initialLiked,
                                                   initialCount,
                                               }) => {
    const canShowFavourite = lot.status === "confirmed";
    const [isRejectDialogOpen, setIsRejectDialogOpen] = React.useState(false);
    const [rejectReason, setRejectReason] = React.useState<string>("");

    const handleReject = () => {
        onReject(rejectReason.trim() || undefined);
        setRejectReason("");
        setIsRejectDialogOpen(false);
    };

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
                        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Reject</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Reject lot</DialogTitle>
                                    <DialogDescription>
                                        Optionally explain why this lot is being rejected.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-2">
                                    <Label htmlFor="reject-reason">Rejection reason (optional)</Label>
                                    <Textarea
                                        id="reject-reason"
                                        value={rejectReason}
                                        onChange={(event) => setRejectReason(event.target.value)}
                                        placeholder="Example: Missing screenshots or download link is broken"
                                    />
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleReject}>
                                        Confirm rejection
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {canShowFavourite && (
                    <FavouriteToggle
                        lotId={lot.id}
                        initialLiked={initialLiked}
                        initialCount={initialCount}
                        size="md"
                        showCount
                    />
                )}

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
