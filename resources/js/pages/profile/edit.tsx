import React from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";

export default function ProfileEdit() {
    const { props } = usePage();
    const user = (props as any).user || (props as any).auth?.user;

    const { data, setData, post, processing, errors, reset, transform } = useForm<{
        name: string;
        email: string;
        current_password: string;
        password: string;
        password_confirmation: string;
        avatar: File | null;
    }>({
        name: user?.name ?? "",
        email: user?.email ?? "",
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
        // PATCH + multipart
        transform((d) => d); // оставим как есть
        post(route("profile.update"), {
            method: "patch",
            forceFormData: true,
            onSuccess: () => {
                if (preview && preview !== user?.avatar_url) {
                    URL.revokeObjectURL(preview);
                }
            },
        });
    };

    const removeAvatar = () => {
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
    };

    return (
        <MainLayout>
            <Head title="Edit profile" />
            <div className="container mx-auto max-w-screen-sm px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="mb-1 text-2xl font-semibold">Profile</h1>
                        <p className="text-sm text-muted-foreground">Update your account information</p>
                    </div>
                    <Link href={route("dashboard")}>
                        <Button variant="outline">Back</Button>
                    </Link>
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
                                <Input
                                    id="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
                                />
                                {errors.avatar && <p className="text-sm text-red-500">{errors.avatar}</p>}
                                <div className="flex gap-2">
                                    <Button type="button" variant="secondary" onClick={() => onAvatarChange(null)}>
                                        Clear
                                    </Button>
                                    <Button type="button" variant="ghost" onClick={removeAvatar}>
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
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <Label htmlFor="email" className="mb-2">Email</Label>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                                {errors.current_password && <p className="mt-1 text-sm text-red-500">{errors.current_password}</p>}
                            </div>
                            <div>
                                <Label htmlFor="password" className="mb-2">New password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
