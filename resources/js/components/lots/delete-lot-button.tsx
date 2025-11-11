import * as React from "react";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "sonner";

export function DeleteLotButton({ lotId, lotName }: { lotId: number; lotName?: string }) {
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onConfirm = () => {
        setLoading(true);
        router.delete(route("lots.destroy", lotId), {
            preserveScroll: true,
            onSuccess: () => toast.success(lotName ? `Deleted "${lotName}"` : "Lot deleted"),
            onError: () => toast.error("Could not delete lot"),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={(v) => !loading && setOpen(v)}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="sm:max-w-[430px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this lot?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {lotName ? <>“{lotName}”</> : "This lot"} will be permanently removed. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:brightness-200"
                        onClick={onConfirm}
                    >
                        {loading ? "Deleting…" : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
