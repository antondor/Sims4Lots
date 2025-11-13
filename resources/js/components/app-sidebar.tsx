import * as React from "react";
import {
    Folder,
    HeartIcon,
    Home,
    Settings,
    ShieldCheck,
    User,
    UserSearch,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar";
import { NavFooter } from "@/components/nav-footer";
import { SidebarSearch } from "@/components/sidebar-search";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

type NavItem = {
    title: string;
    url: string;
    icon: React.ComponentType<any>;
};

export function AppSidebar() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;
    const isAuthenticated = !!user;
    const isAdmin = !!user?.is_admin;

    const items: NavItem[] = React.useMemo(() => {
        const base: NavItem[] = [
            { title: "Dashboard", url: route("dashboard"), icon: Home },
            { title: "Search Users", url: route("users.index"), icon: UserSearch },
        ];

        if (!isAuthenticated) {
            return base;
        }

        return [
            ...base,
            { title: "My Profile", url: route("profile.show"), icon: User },
            { title: "My Lots", url: route("lots.mine"), icon: Folder },
            {
                title: "Favourites",
                url: route("favourites.index", { user: user.id }), // /favourites/{user}
                icon: HeartIcon,
            },
            { title: "Settings", url: route("settings"), icon: Settings },
        ];
    }, [isAuthenticated, user?.id]);

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
