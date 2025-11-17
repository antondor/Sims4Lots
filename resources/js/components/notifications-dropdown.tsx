import * as React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Bell, CheckCheck } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotificationItem, NotificationsState } from "@/types";

dayjs.extend(relativeTime);

const csrfToken = (
    document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null
)?.content ?? "";

async function postJson(url: string): Promise<void> {
    await fetch(url, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": csrfToken,
        },
    });
}

type PageProps = { notifications?: NotificationsState | null; auth: { user: unknown | null } };

export function NotificationsDropdown() {
    const { props } = usePage<PageProps>();
    const notifications = props.notifications ?? null;

    const [items, setItems] = React.useState<NotificationItem[]>(notifications?.items ?? []);
    const [unreadCount, setUnreadCount] = React.useState<number>(notifications?.unread_count ?? 0);

    React.useEffect(() => {
        setItems(notifications?.items ?? []);
        setUnreadCount(notifications?.unread_count ?? 0);
    }, [notifications?.items, notifications?.unread_count]);

    if (!props.auth?.user) {
        return null;
    }

    const markAllAsRead = async () => {
        if (!unreadCount) return;

        await postJson(route("notifications.read-all"));
        setItems((prev) => prev.map((item) => ({ ...item, read_at: item.read_at ?? new Date().toISOString() })));
        setUnreadCount(0);
    };

    const handleItemSelect = async (event: Event, item: NotificationItem) => {
        event.preventDefault();

        if (!item.read_at) {
            await postJson(route("notifications.read", { notification: item.id }));
            setItems((prev) =>
                prev.map((current) =>
                    current.id === item.id ? { ...current, read_at: new Date().toISOString() } : current
                )
            );
            setUnreadCount((count) => Math.max(0, count - 1));
        }

        if (item.url) {
            window.location.href = item.url;
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] justify-center rounded-full px-1 text-[11px]">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-7 px-2 text-xs">
                            <CheckCheck className="mr-1 h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {items.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground">No notifications yet.</div>
                ) : (
                    items.map((item) => (
                        <DropdownMenuItem
                            key={item.id}
                            className="flex cursor-pointer flex-col items-start gap-1 whitespace-normal py-3"
                            onSelect={(event) => handleItemSelect(event, item)}
                        >
                            <span className={cn("text-sm", !item.read_at && "font-semibold text-foreground")}>
                                {item.message}
                            </span>
                            <span className="text-xs text-muted-foreground">{dayjs(item.created_at).fromNow()}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
