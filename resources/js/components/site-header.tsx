import { SiteHeaderSearch } from "@/components/site-header-search";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { Link } from "@inertiajs/react";
import { NotificationsDropdown } from "@/components/notifications-dropdown";
import { LayoutDashboard } from "lucide-react";
import { MobileNav } from "@/components/mobile-nav";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full bg-[#f7f8fa]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#f7f8fa]/60 shadow-sm dark:bg-background/95 dark:shadow-secondary/20">
            <div className="container flex h-16 items-center px-4 md:px-8 max-w-screen-2xl mx-auto">
                <MobileNav />

                <div className="flex md:hidden items-center ml-4 mr-4 shrink-0">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
                            PLOTPALETTE
                        </span>
                    </Link>
                </div>

                <div className="mr-8 hidden md:flex">
                    <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
                        <LayoutDashboard className="h-6 w-6 text-primary" />
                        <span className="hidden font-extrabold text-lg tracking-tight text-gray-900 sm:inline-block dark:text-white">
                            PLOTPALETTE
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex md:flex-1">
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2 min-w-0">
                    <div className="flex-1 min-w-0 md:flex-none md:w-auto mr-2 md:mr-4">
                        <div className="relative w-full">
                            <div className="w-full md:w-[280px] lg:w-[320px]">
                                <SiteHeaderSearch />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-700 shrink-0">
                        <NotificationsDropdown />
                        <UserNav />
                    </div>
                </div>
            </div>

            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </header>
    );
}
