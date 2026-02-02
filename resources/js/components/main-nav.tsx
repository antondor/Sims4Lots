import * as React from "react";
import { Link, usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { route } from "ziggy-js";

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
    const { props: pageProps } = usePage();

    // Извлекаем данные из общего стейта Inertia
    const user = (pageProps as any)?.auth?.user;
    const adminData = (pageProps as any)?.admin;

    const isAuthenticated = !!user;
    const isAdmin = user?.is_admin;
    const pendingLotsCount = adminData?.pending_lots_count || 0;

    const links = [
        { title: "Dashboard", href: route("dashboard"), active: route().current("dashboard") },
    ];

    const authLinks = [
        { title: "My Lots", href: route("lots.mine"), active: route().current("lots.mine") },
    ];

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

            {isAuthenticated && authLinks.map((link) => (
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
