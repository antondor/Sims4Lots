import * as React from "react";
import { PageBreadcrumbs, Crumb } from "@/components/page-breadcrumbs";

export function PageHeader({
                               title,
                               subtitle,
                               breadcrumbs,
                               actions,
                           }: {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    breadcrumbs?: Crumb[];
    actions?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
                {breadcrumbs?.length ? <PageBreadcrumbs items={breadcrumbs} className="mb-1" /> : null}
                <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
    );
}
