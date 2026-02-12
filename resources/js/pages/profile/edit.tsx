import React from "react";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { route } from "ziggy-js";
import { toast } from "sonner";
import type { BreadcrumbItem } from "@/types";
import { BackButton } from "@/components/back-button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Upload, User, Shield, Globe, MailWarning, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RichTextEditor } from "@/components/common/rich-text-editor";

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
        email: user?.unverified_email ?? user?.email ?? "",
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
        if (preview && preview !== user?.avatar_url) URL.revokeObjectURL(preview);
        setPreview(file ? URL.createObjectURL(file) : user?.avatar_url ?? null);
    };

    const handleDeleteAvatar = () => {
        if (!confirm("Are you sure you want to remove your avatar?")) return;

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

    const handleCancelEmailChange = () => {
        if (!confirm("Cancel pending email change?")) return;
        router.delete(route('profile.email.cancel'), {
            onSuccess: () => {
                toast.success("Email change cancelled");
                setData('email', user.email);
            }
        });
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

            <div className="container mx-auto max-w-4xl px-4 py-6 md:py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground">Manage your profile and account settings.</p>
                    </div>
                    <BackButton />
                </div>

                {user.unverified_email && (
                    <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800 flex items-start justify-between">
                        <div className="flex gap-3">
                            <MailWarning className="h-5 w-5 mt-0.5" />
                            <div>
                                <AlertTitle>Pending Email Change</AlertTitle>
                                <AlertDescription>
                                    Verification sent to <strong>{user.unverified_email}</strong>
                                    Currently using <strong>{user.email}</strong>
                                </AlertDescription>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEmailChange}
                            className="text-amber-800 hover:text-amber-900 hover:bg-amber-100 h-8 px-2"
                        >
                            <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                    </Alert>
                )}

                <form onSubmit={submit} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Basic Information
                            </CardTitle>
                            <CardDescription>Your public profile information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
                                <div className="relative group">
                                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-border shadow-sm">
                                        {preview ? (
                                            <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                                                <User className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
                                        <Upload className="h-4 w-4" />
                                    </label>
                                    <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)} />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <h4 className="font-medium">Profile Picture</h4>
                                    <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 2MB.</p>
                                    <div className="flex gap-2 pt-2">
                                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
                                            Change
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleDeleteAvatar}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Remove
                                        </Button>
                                    </div>
                                    {pageErrors.avatar && <p className="text-sm text-red-500">{pageErrors.avatar}</p>}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData("name", e.target.value)} />
                                    {pageErrors.name && <p className="text-sm text-red-500">{pageErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                        />
                                        {data.email !== user.email && data.email !== user.unverified_email && (
                                            <Button type="submit" variant="secondary" disabled={processing}>
                                                Verify
                                            </Button>
                                        )}
                                    </div>
                                    {pageErrors.email && <p className="text-sm text-red-500">{pageErrors.email}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Profile Details
                            </CardTitle>
                            <CardDescription>Tell the community about yourself.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="short_about">Short Tagline</Label>
                                <Input
                                    id="short_about"
                                    maxLength={280}
                                    placeholder="Builder & Creator."
                                    value={data.short_about ?? ""}
                                    onChange={(e) => setData("short_about", e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground text-right">{data.short_about?.length ?? 0}/280</p>
                                {pageErrors.short_about && <p className="text-sm text-red-500">{pageErrors.short_about}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="about">Biography</Label>
                                
                                <RichTextEditor 
                                    value={data.about ?? ""}
                                    onChange={(val) => setData("about", val)}
                                    error={pageErrors.about}
                                />
                                
                                {pageErrors.about && <p className="text-sm text-red-500">{pageErrors.about}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="external_url">Portfolio / Website</Label>
                                    <Input id="external_url" type="url" placeholder="https://" value={data.external_url ?? ""} onChange={(e) => setData("external_url", e.target.value)} />
                                    {pageErrors.external_url && <p className="text-sm text-red-500">{pageErrors.external_url}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="sims_gallery_id">Origin / Gallery ID</Label>
                                    <Input id="sims_gallery_id" value={data.sims_gallery_id ?? ""} onChange={(e) => setData("sims_gallery_id", e.target.value)} />
                                    {pageErrors.sims_gallery_id && <p className="text-sm text-red-500">{pageErrors.sims_gallery_id}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5" />
                                Security
                            </CardTitle>
                            <CardDescription>Update your password. Leave blank to keep current.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current_password">Current Password</Label>
                                <Input id="current_password" type="password" value={data.current_password} onChange={(e) => setData("current_password", e.target.value)} />
                                {pageErrors.current_password && <p className="text-sm text-red-500">{pageErrors.current_password}</p>}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="password">New Password</Label>
                                    <Input id="password" type="password" value={data.password} onChange={(e) => setData("password", e.target.value)} />
                                    {pageErrors.password && <p className="text-sm text-red-500">{pageErrors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData("password_confirmation", e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t bg-muted/20 px-6 py-4">
                            <Button type="submit" disabled={processing} size="lg">
                                Save Changes
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </MainLayout>
    );
}
