import React from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";

export default function SettingsIndex() {
    const { props } = usePage();
    const user = (props as any)?.auth?.user;

    return (
        <MainLayout>
            <Head title="Settings" />
            <div className="container mx-auto max-w-screen-sm px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-semibold">Settings</h1>
                        <p className="text-sm text-muted-foreground">Application preferences</p>
                    </div>
                    <Link href={route("dashboard")}>
                        <Button variant="outline">Back</Button>
                    </Link>
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
                        <p className="mb-4 text-sm text-muted-foreground">
                            Theme & layout preferences (coming soon).
                        </p>
                        <Button variant="secondary" disabled>
                            Coming soon
                        </Button>
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
