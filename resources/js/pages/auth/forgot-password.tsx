import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <MainLayout>
            <Head title="Forgot Password" />

            <div className="flex w-full justify-center">
                <div className="w-full max-w-sm px-4 py-8 sm:py-12">
                    <h1 className="mb-1 text-2xl font-semibold tracking-tight">
                        Reset Password
                    </h1>
                    <p className="mb-6 text-sm text-muted-foreground">
                        Enter your email to receive a reset link.
                    </p>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <div className="rounded-xl border bg-card/80 p-4 shadow-sm backdrop-blur-sm sm:p-6">
                        <form onSubmit={submit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoFocus
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="mt-2 w-full"
                            >
                                Email Password Reset Link
                            </Button>
                        </form>
                    </div>

                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                            href={route("login")}
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}