"use client";

import { useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle,
    DrawerHeader,
    DrawerClose,
    DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, LayoutDashboard, Home, Folder } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

export function MobileNav() {
    const [open, setOpen] = useState(false);

    const { props: pageProps } = usePage();
    const auth = (pageProps as any).auth;
    const user = auth?.user;

    return (
        <Drawer direction="left" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="ghost" className="px-0 md:hidden">
                    <Menu className="h-6 w-6" />
                </Button>
            </DrawerTrigger>

            <DrawerContent className="h-full w-[280px] mt-0 outline-none border-r">

                <div className="hidden" />

                <DrawerHeader className="text-left border-b pb-4 pt-6">
                    <DrawerTitle asChild>
                        <Link
                            href="/"
                            className="flex items-center gap-2 w-fit"
                            onClick={() => setOpen(false)}
                        >
                            <LayoutDashboard className="h-6 w-6 text-primary" />
                            <span className="font-bold text-lg">PLOTPALETTE</span>
                        </Link>
                    </DrawerTitle>
                </DrawerHeader>

                <div className="p-4 space-y-4">
                    <div className="flex flex-col space-y-2">
                        <MobileLink href={route("dashboard")} onOpenChange={setOpen}>
                            <Home className="mr-2 h-5 w-5" />
                            Dashboard
                        </MobileLink>

                        <MobileLink href={route("myLots")} onOpenChange={setOpen}>
                            <Folder className="mr-2 h-5 w-5" />
                            My Lots
                        </MobileLink>

                        {user && (
                            <MobileLink href={route("favourites.index", { user: user.id })} onOpenChange={setOpen}>
                                <Folder className="mr-2 h-5 w-5" />
                                Favourites
                            </MobileLink>
                        )}
                    </div>
                </div>

                <DrawerFooter className="pt-2 mt-auto">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function MobileLink({ href, onOpenChange, className, children, ...props }: any) {
    return (
        <Link
            href={href}
            onClick={() => onOpenChange?.(false)}
            className={cn(
                "flex items-center rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-muted focus:bg-muted focus:outline-none",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
