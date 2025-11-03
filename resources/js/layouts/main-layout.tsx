import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import React from "react";
import {Toaster} from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex-1">
                <SidebarTrigger />
                <div className="container mx-auto max-w-screen-2xl px-4">
                    {children}
                    <Toaster richColors position="top-center" />
                </div>
            </main>
        </SidebarProvider>
    )
}
