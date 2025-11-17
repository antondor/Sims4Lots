import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BreadcrumbItem } from "@/types";
import { useTheme } from "@/components/theme-provider";
import { BackButton } from "@/components/back-button";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Home", href: route("dashboard") },
    { title: "Settings" },
];

export default function SettingsIndex() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;
    const { theme, setTheme } = useTheme();

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />
            <div className="container mx-auto max-w-screen-sm px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-semibold">Settings</h1>
                        <p className="text-sm text-muted-foreground">Application preferences</p>
                    </div>
                    <BackButton />
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 text-lg font-medium">Profile</h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Update your personal information and change password.
                        </p>
                        <Link href={route("profile.edit")}>
                            <Button>Edit profile</Button>
                        </Link>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 text-lg font-medium">Appearance</h2>
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <Label htmlFor="theme-toggle" className="text-base font-medium">
                                    Dark theme
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark appearance.
                                </p>
                            </div>
                            <Switch
                                id="theme-toggle"
                                checked={theme === "dark"}
                                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                                aria-label="Toggle dark mode"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border p-4">
                        <h2 className="mb-2 text-lg font-medium">Account</h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                            Sign out or delete your account.
                        </p>
                        <form action={route("logout")} method="post">
                            <Button type="submit" variant="outline">Logout</Button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
