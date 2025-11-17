import { LucideIcon } from "lucide-react";

export interface Auth { user: User | null; }

export interface BreadcrumbItem { title: string; href?: string; }

export interface NotificationItem {
    id: string;
    type: string;
    message: string;
    url?: string | null;
    created_at: string;
    read_at?: string | null;
}

export interface NotificationsState {
    unread_count: number;
    items: NotificationItem[];
}

export interface NavGroup { title: string; items: NavItem[]; }

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    notifications?: NotificationsState | null;
    navigation?: {
        intended_url?: string | null;
        previous_url?: string | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    avatar_url?: string | null;
    is_admin?: boolean;
    last_seen_at?: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export interface PaginatedData<T = unknown> {
    current_page: number | null;
    data: T[];
    first_page_url: string | null;
    last_page_url: string | null;
    last_page: number | null;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string | null;
    per_page: number | null;
    prev_page_url: string | null;
    from: number | null;
    to: number | null;
    total: number | null;
    [key: string]: unknown;
}
