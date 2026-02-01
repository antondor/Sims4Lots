import * as React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { CircleUserRound, LogOut, Settings, Heart, Folder, User } from "lucide-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Убедитесь, что этот компонент есть в shadcn
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Желательно иметь Avatar из shadcn
import { route } from "ziggy-js";

export function UserNav() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link href={route("login")} className="text-sm font-medium text-muted-foreground hover:text-primary">
                    Sign in
                </Link>
                <Link href={route("register")}>
                    <Button size="sm">Register</Button>
                </Link>
            </div>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} alt={user.name} />
                        <AvatarFallback><CircleUserRound className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={route("profile.show")} className="w-full cursor-pointer">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("lots.mine")} className="w-full cursor-pointer">
                            <Folder className="mr-2 h-4 w-4" />
                            <span>My lots</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("favourites.index", { user: user.id })} className="w-full cursor-pointer">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favourites</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href={route("settings")} className="w-full cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => router.post(route("logout"))}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
