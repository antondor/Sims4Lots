import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const { props: pageProps } = usePage();

    const auth = (pageProps as any).auth;
    const user = auth?.user;
    const adminData = (pageProps as any).admin;

    const isAdmin = !!user?.is_admin;
    const pendingLotsCount = adminData?.pending_lots_count || 0;

    const links = [
        { title: "Dashboard", href: route("dashboard"), active: route().current("dashboard") },
    ];

    const authLinks = user ? [
        { title: "My Lots", href: route("myLots"), active: route().current("myLots") },
        { title: "Favourites", href: route("favourites.index", { user: user.id }), active: route().current("favourites.index") },
    ] : [];

    return (
        <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        link.active ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {link.title}
                </Link>
            ))}

            {authLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        link.active ? "text-foreground" : "text-muted-foreground",
                    )}
                >
                    {link.title}
                </Link>
            ))}

            {isAdmin && pendingLotsCount > 0 && (
                <Link
                    href={route("admin.lots.pending")}
                    className={cn(
                        "relative flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors text-sm font-bold",
                        route().current("admin.lots.pending") ? "ring-2 ring-yellow-500" : ""
                    )}
                >
                    Pending Lots
                    <span className="ml-2 bg-yellow-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {pendingLotsCount}
                    </span>
                </Link>
            )}
        </nav>
    );
}
