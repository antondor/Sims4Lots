import * as React from "react";
import { Toaster } from "sonner";
import { FlashToaster } from "@/components/flash-toaster";
import { SiteHeader } from "@/components/site-header";
import type { BreadcrumbItem } from "@/types";

type Props = {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    rightSlot?: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
    return (
        <div className="relative flex min-h-screen flex-col bg-background">
            <SiteHeader />

            <main className="flex-1">
                <div className="container mx-auto max-w-screen-2xl py-6 px-4 md:px-8">
                    {children}
                </div>
            </main>

            <Toaster position="bottom-right" />
            <FlashToaster />
        </div>
    );
}
