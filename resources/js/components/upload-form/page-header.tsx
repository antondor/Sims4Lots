import React from "react";

export function PageHeader({
                               title,
                               subtitle,
                               right,
                           }: {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="mb-6 flex items-center justify-between">
            <div>
                <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
                {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {right}
        </div>
    );
}
