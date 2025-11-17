// resources/js/pages/profile/edit.tsx
import React from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { route } from "ziggy-js";
import { toast } from "sonner";
import type { BreadcrumbItem } from "@/types";
import { BackButton } from "@/components/back-button";

export default function ProfileEdit() {
    const { props } = usePage();
    const user = (props as any).user || (props as any).auth?.user;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Home", href: route("dashboard") },
        { title: "Users", href: route("users.index") },
        { title: user.name, href: route("profile.show") },
        { title: "Edit" },
    ];

    const pageErrors = ((props as any).errors ?? {}) as Record<string, string>;

    const { data, setData, processing } = useForm<{
        name: string;
        email: string;
        short_about: string | null;
        about: string | null;
        external_url: string | null;
        sims_gallery_id: string | null;
        current_password: string;
        password: string;
        password_confirmation: string;
        avatar: File | null;
    }>({
        name: user?.name ?? "",
        email: user?.email ?? "",
        short_about: user?.short_about ?? "",
        about: user?.about ?? "",
        external_url: user?.external_url ?? "",
        sims_gallery_id: user?.sims_gallery_id ?? "",
        current_password: "",
        password: "",
        password_confirmation: "",
        avatar: null,
    });

    const [preview, setPreview] = React.useState<string | null>(user?.avatar_url ?? null);

    const onAvatarChange = (file: File | null) => {
        setData("avatar", file);
        if (preview) URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : user?.avatar_url ?? null);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append("_method", "PATCH");
        fd.append("name", data.name ?? "");
        fd.append("email", data.email ?? "");
        fd.append("short_about", data.short_about ?? "");
        fd.append("about", data.about ?? "");
        fd.append("external_url", data.external_url ?? "");
        fd.append("sims_gallery_id", data.sims_gallery_id ?? "");
        if (data.current_password) fd.append("current_password", data.current_password);
        if (data.password) fd.append("password", data.password);
        if (data.password_confirmation) fd.append("password_confirmation", data.password_confirmation);
        if (data.avatar) fd.append("avatar", data.avatar);

        router.post(route("profile.update"), fd, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => toast.success("Profile updated"),
            onError: () => toast.error("Failed to update profile"),
        });
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit profile" />
            <div className="container mx-auto max-w-screen-sm px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-semibold">Profile</h1>
                        <p className="text-sm text-muted-foreground">Update your account information</p>
                    </div>
                    <BackButton />
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 overflow-hidden rounded-full border">
                                {preview ? (
                                    <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">N/A</div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="avatar">Avatar</Label>
                                <Input id="avatar" type="file" accept="image/*" onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)} />
                                {pageErrors.avatar && <p className="text-sm text-red-500">{pageErrors.avatar}</p>}
                                <div className="flex gap-2">
                                    <Button type="button" variant="secondary" onClick={() => onAvatarChange(null)}>
                                        Clear
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            const form = document.createElement("form");
                                            form.method = "post";
                                            form.action = route("profile.avatar.destroy");
                                            const csrf = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
                                            if (csrf?.content) {
                                                const token = document.createElement("input");
                                                token.type = "hidden";
                                                token.name = "_token";
                                                token.value = csrf.content;
                                                form.appendChild(token);
                                            }
                                            const method = document.createElement("input");
                                            method.type = "hidden";
                                            method.name = "_method";
                                            method.value = "DELETE";
                                            form.appendChild(method);
                                            document.body.appendChild(form);
                                            form.submit();
                                        }}
                                    >
                                        Remove current
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="grid gap-6 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <Label htmlFor="name" className="mb-2">Name</Label>
                            <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                            {pageErrors.name && <p className="mt-1 text-sm text-red-500">{pageErrors.name}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                            {pageErrors.email && <p className="mt-1 text-sm text-red-500">{pageErrors.email}</p>}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-medium">Public profile</h2>

                        <div className="grid gap-6">
                            <div>
                                <Label htmlFor="short_about" className="mb-2">Short intro</Label>
                                <Input
                                    id="short_about"
                                    maxLength={280}
                                    placeholder="A short tagline shown under your name"
                                    value={data.short_about ?? ""}
                                    onChange={(e) => setData("short_about", e.target.value)}
                                />
                                {pageErrors.short_about && <p className="mt-1 text-sm text-red-500">{pageErrors.short_about}</p>}
                                <p className="mt-1 text-xs text-muted-foreground">Up to 280 characters.</p>
                            </div>

                            <div>
                                <Label htmlFor="about" className="mb-2">Bio</Label>
                                <Textarea id="about" rows={5} value={data.about ?? ""} onChange={(e) => setData("about", e.target.value)} />
                                {pageErrors.about && <p className="mt-1 text-sm text-red-500">{pageErrors.about}</p>}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <Label htmlFor="external_url" className="mb-2">External portfolio URL</Label>
                                    <Input
                                        id="external_url"
                                        type="url"
                                        placeholder="https://example.com"
                                        value={data.external_url ?? ""}
                                        onChange={(e) => setData("external_url", e.target.value)}
                                    />
                                    {pageErrors.external_url && <p className="mt-1 text-sm text-red-500">{pageErrors.external_url}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="sims_gallery_id" className="mb-2">Sims 4 Gallery ID</Label>
                                    <Input
                                        id="sims_gallery_id"
                                        value={data.sims_gallery_id ?? ""}
                                        onChange={(e) => setData("sims_gallery_id", e.target.value)}
                                    />
                                    {pageErrors.sims_gallery_id && <p className="mt-1 text-sm text-red-500">{pageErrors.sims_gallery_id}</p>}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-lg font-medium">Change password</h2>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label htmlFor="current_password" className="mb-2">Current password</Label>
                                <Input
                                    id="current_password"
                                    type="password"
                                    value={data.current_password}
                                    onChange={(e) => setData("current_password", e.target.value)}
                                />
                                {pageErrors.current_password && <p className="mt-1 text-sm text-red-500">{pageErrors.current_password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password" className="mb-2">New password</Label>
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
                                {pageErrors.password && <p className="mt-1 text-sm text-red-500">{pageErrors.password}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <Label htmlFor="password_confirmation" className="mb-2">Confirm new password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center justify-end gap-3">
                        <Link href={route("dashboard")} className="inline-flex">
                            <Button type="button" variant="ghost">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={processing}>Save changes</Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
