import { CircleUserRound, Folder, HeartIcon, Home, SearchIcon, Settings } from "lucide-react";
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

const items = [
    { title: "Home", url: "/dashboard", icon: Home },
    { title: "Search", url: "#", icon: SearchIcon },
    { title: "Account", url: "#", icon: CircleUserRound },
    { title: "My lots", url: "#", icon: Folder },
    { title: "Favourites", url: "#", icon: HeartIcon },
    { title: "Settings", url: "#", icon: Settings },
];

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
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
