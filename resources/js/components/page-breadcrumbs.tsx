import * as React from "react";
import { Link } from "@inertiajs/react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { title: string; href?: string };

export function PageBreadcrumbs({
                                    items,
                                    className,
                                    separatorClassName,
                                }: {
    items: Crumb[];
    className?: string;
    separatorClassName?: string;
}) {
    if (!items?.length) return null;

    return (
        <nav aria-label="Breadcrumb">
            <ol className={cn("flex flex-wrap items-center gap-1 text-sm text-muted-foreground", className)}>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;
                    return (
                        <li key={`${item.title}-${idx}`} className="inline-flex items-center gap-1">
                            {item.href && !isLast ? (
                                <Link href={item.href} className="hover:text-foreground hover:underline underline-offset-4">
                                    {item.title}
                                </Link>
                            ) : (
                                <span className={cn(isLast ? "text-foreground" : "")}>{item.title}</span>
                            )}
                            {!isLast && <ChevronRight className={cn("mx-1 h-4 w-4", separatorClassName)} aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
