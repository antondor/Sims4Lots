import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {route} from "ziggy-js";
import {BreadcrumbItem} from "@/types";

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
            <div className="container mx-auto max-w-sm px-4 py-12 w-sm">
                <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoFocus
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                        />
                        {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(v) => setData("remember", Boolean(v))}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">Sign in</Button>
                </form>

                <p className="mt-4 text-sm text-muted-foreground">
                    No account?{" "}
                    <Link href={route("register")} className="underline">Create one</Link>
                </p>
            </div>
        </MainLayout>
    );
}
