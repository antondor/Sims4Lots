import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {route} from "ziggy-js";
import {BreadcrumbItem} from "@/types";

export default function Register() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Register" },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("register.attempt"));
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Register" />
            <div className="container mx-auto max-w-sm px-4 py-12">
                <h1 className="mb-6 text-2xl font-semibold">Create account</h1>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
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

                    <div>
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData("password_confirmation", e.target.value)}
                        />
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">Create account</Button>
                </form>

                <p className="mt-4 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href={route("login")} className="underline">Sign in</Link>
                </p>
            </div>
        </MainLayout>
    );
}
