import {Folder, HeartIcon, Home, Settings, ShieldCheck, User, UserSearch} from "lucide-react";
import {
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import { NavFooter } from "@/components/nav-footer";
import { SidebarSearch } from "@/components/sidebar-search";
import { usePage } from "@inertiajs/react";

const items = [
    { title: "Dashboard",  url: "/dashboard",  icon: Home },
    { title: "My Profile",    url: "/profile",    icon: User },
    { title: "Search Users", url: "/users", icon: UserSearch },
    { title: "My Lots",    url: "/lots/mine",  icon: Folder },
    { title: "Favourites", url: "/favourites", icon: HeartIcon },
    { title: "Settings",   url: "/settings",   icon: Settings },
];

export function AppSidebar() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;
    const isAdmin = !!user?.is_admin;

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

                {isAdmin && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <a href="/admin/lots/pending">
                                            <ShieldCheck />
                                            <span>Pending Lots</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            {SidebarFooter ? (
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
