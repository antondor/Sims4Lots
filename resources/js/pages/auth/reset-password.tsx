import React from "react";
import { Head, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.update"));
    };

    return (
        <MainLayout>
            <Head title="Reset Password" />

            <div className="flex w-full justify-center">
                <div className="w-full max-w-sm px-4 py-8 sm:py-12">
                    <h1 className="mb-1 text-2xl font-semibold tracking-tight">
                        Set New Password
                    </h1>
                    
                    <div className="mt-6 rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
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
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoFocus
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full"
                            >
                                Reset Password
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}