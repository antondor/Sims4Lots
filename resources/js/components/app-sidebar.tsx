import { CircleUserRound, Folder, HeartIcon, Home, Settings } from "lucide-react";
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { NavFooter } from "@/components/nav-footer";
import { SidebarSearch } from "@/components/sidebar-search";

const items = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Profile", url: "/profile", icon: CircleUserRound },
    { title: "My lots", url: "/lots/mine", icon: Folder },
    { title: "Favourites", url: "/favourites", icon: HeartIcon },
    { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="mb-3">
                            <SidebarSearch />
                        </div>

                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {typeof SidebarFooter !== "undefined" ? (
                <SidebarFooter>
                    <NavFooter />
                </SidebarFooter>
            ) : (
                <div className="mt-auto border-t">
                    <NavFooter />
                </div>
            )}
        </Sidebar>
    );
}
