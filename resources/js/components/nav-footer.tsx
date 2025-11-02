import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { ChevronUp, ChevronDown, CircleUserRound, LogOut, Settings, Heart, Folder, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {route} from "ziggy-js";

export function NavFooter() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;
    const [open, setOpen] = React.useState(false);

    if (!user) {
        return (
            <div className="flex w-full gap-2 p-3">
                <Link
                    href={route("login")}
                    className="inline-flex w-1/2 items-center justify-center rounded-md border px-3 py-2 text-sm"
                >
                    Sign in
                </Link>
                <Link
                    href={route("register")}
                    className="inline-flex w-1/2 items-center justify-center rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="p-3">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2 text-left transition hover:bg-accent"
                    >
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border">
                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                    <CircleUserRound className="h-5 w-5" />
                                </div>
                            )}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">{user.name}</div>
                            {user.email ? (
                                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                            ) : null}
                        </div>

                        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent side="top" align="end" className="w-56">
                    <DropdownMenuLabel className="text-xs text-muted-foreground">Account</DropdownMenuLabel>

                    <DropdownMenuItem asChild>
                        <Link href={route("profile.edit")}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={route("lots.mine")}>
                            <Folder className="mr-2 h-4 w-4" />
                            <span>My lots</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={route("favourites.index")}>
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favourites</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={route("settings")}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={route("logout")} method="post" as="button">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
