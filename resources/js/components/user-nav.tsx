"use client";

import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { CircleUserRound, LogOut, Settings, Heart, Folder, User } from "lucide-react";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

function useMediaQuery(query: string) {
    const [value, setValue] = React.useState(false);
    React.useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }
        const result = matchMedia(query);
        result.addEventListener("change", onChange);
        setValue(result.matches);
        return () => result.removeEventListener("change", onChange);
    }, [query]);
    return value;
}

export function UserNav() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link href={route("login")} className="whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-primary">
                    Sign in
                </Link>
                <Link href={route("register")}>
                    <Button size="sm">Register</Button>
                </Link>
            </div>
        );
    }

    const AvatarButton = (
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar_url} alt={user.name} />
                <AvatarFallback><CircleUserRound className="h-5 w-5" /></AvatarFallback>
            </Avatar>
        </Button>
    );

    if (isDesktop) {
        return (
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    {AvatarButton}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
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
                        <Link href={route("myLots")} className="w-full cursor-pointer">
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

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {AvatarButton}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left pb-2">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar_url} alt={user.name} />
                            <AvatarFallback><CircleUserRound className="h-6 w-6" /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <DrawerTitle>{user.name}</DrawerTitle>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                </DrawerHeader>

                <div className="p-4 space-y-2">
                    <MobileMenuLink href={route("profile.show")} icon={User} setOpen={setOpen}>
                        Profile
                    </MobileMenuLink>
                    <MobileMenuLink href={route("myLots")} icon={Folder} setOpen={setOpen}>
                        My lots
                    </MobileMenuLink>
                    <MobileMenuLink href={route("favourites.index", { user: user.id })} icon={Heart} setOpen={setOpen}>
                        Favourites
                    </MobileMenuLink>
                    <MobileMenuLink href={route("settings")} icon={Settings} setOpen={setOpen}>
                        Settings
                    </MobileMenuLink>

                    <Separator className="my-2" />

                    <button
                        onClick={() => {
                            setOpen(false);
                            router.post(route("logout"));
                        }}
                        className="flex w-full items-center rounded-md px-3 py-3 text-base font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Log out
                    </button>
                </div>

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function MobileMenuLink({ href, icon: Icon, children, setOpen }: any) {
    return (
        <Link
            href={href}
            onClick={() => setOpen(false)}
            className="flex items-center rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted"
        >
            <Icon className="mr-3 h-5 w-5 text-muted-foreground" />
            {children}
        </Link>
    );
}
