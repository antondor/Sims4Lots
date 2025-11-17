import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { route } from "ziggy-js";
import type { BreadcrumbItem } from "@/types";

export default function Login() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Login" },
    ];

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login.attempt"));
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Login" />

            <div className="flex w-full justify-center">
                <div className="w-full max-w-sm px-4 py-8 sm:py-12">
                    <h1 className="mb-1 text-2xl font-semibold tracking-tight">
                        Sign in
                    </h1>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Welcome back. Enter your details to continue.
                    </p>

                    <div className="rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoFocus
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(v) =>
                                            setData("remember", Boolean(v))
                                        }
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-xs sm:text-sm text-muted-foreground"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                {/* если потом добавишь "Forgot password?" — место уже есть */}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full"
                            >
                                Sign in
                            </Button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        No account?{" "}
                        <Link
                            href={route("register")}
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
