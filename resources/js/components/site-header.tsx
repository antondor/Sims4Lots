import { SiteHeaderSearch } from "@/components/site-header-search";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Link } from "@inertiajs/react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { LayoutDashboard } from "lucide-react";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm dark:bg-background/95 dark:shadow-secondary/20">
            <div className="container flex h-16 items-center px-4 md:px-8 max-w-screen-2xl mx-auto">
                <div className="mr-8 hidden md:flex">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="hidden font-extrabold text-lg tracking-tight text-gray-900 sm:inline-block dark:text-white">
                           PROJECT NAME
                        </span>
                    </Link>
                </div>

                 <div className="hidden md:flex md:flex-1">
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none mr-4">
                        <div className="relative">
                           <div className="md:w-[280px] lg:w-[320px]">
                                <SiteHeaderSearch />
                           </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
                         <NotificationsDropdown />
                         <UserNav />
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </header>
    );
}
