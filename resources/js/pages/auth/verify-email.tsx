import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import MainLayout from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { Mail, LogOut, ArrowRight, CheckCircle2 } from "lucide-react";

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("verification.send"));
    };

    return (
        <MainLayout>
            <Head title="Verify Email" />

            <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Mail className="h-8 w-8" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">Check your inbox</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Thanks for signing up! We've sent a verification link to your email address.
                        </p>
                    </div>

                    {status === "verification-link-sent" ? (
                        <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                            <p>
                                A new verification link has been sent to the email address
                                you provided during registration.
                            </p>
                        </div>
                    ) : (
                        <div className="mb-6 rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                            Didn't receive the email? Check your spam folder or request a new one below.
                        </div>
                    )}

                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <Button className="w-full gap-2" disabled={processing} size="lg">
                            Resend Verification Email
                            <ArrowRight className="h-4 w-4" />
                        </Button>

                        <div className="flex justify-center">
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                            >
                                <LogOut className="h-4 w-4" />
                                Log Out
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
