import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { FlashToaster } from "@/components/flash-toaster";
import { Breadcrumbs } from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/types";
import { NotificationsDropdown } from "@/components/notifications-dropdown";

type Props = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    rightSlot?: React.ReactNode;
};

export default function MainLayout({
                                       children,
                                       breadcrumbs = [{ title: "Home", href: "/dashboard" }],
                                       rightSlot,
                                   }: Props) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
                        <div className="flex max-w-screen-2xl items-center gap-2 px-4 py-2">
                            <SidebarTrigger className="-ml-1" />
                            <Breadcrumbs breadcrumbs={breadcrumbs} />
                            <div className="ml-auto flex items-center gap-2">
                                {rightSlot}
                                <NotificationsDropdown />
                            </div>
                        </div>
                    </header>

                    <main className="mx-auto w-full max-w-screen-2xl px-4 pb-8 pt-4">
                        {children}
                    </main>

                    <Toaster position="bottom-right" />
                    <FlashToaster />
                </div>
            </div>
        </SidebarProvider>
    );
}
