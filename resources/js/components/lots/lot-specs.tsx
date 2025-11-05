import * as React from "react";

export function LotSpecsGrid({ children }: { children: React.ReactNode }) {
    return (
        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {children}
        </dl>
    );
}

export function SpecItem({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-background/50 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="text-sm font-medium">{value}</dd>
        </div>
    );
}
