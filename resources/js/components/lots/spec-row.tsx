import React from "react";

type LotSpecRowProps = {
    icon: React.ReactNode;
    label: string;
    value: string | number | null | undefined;
};

export function LotSpecRow({ icon, label, value }: LotSpecRowProps) {
    const displayValue = value ?? "—";

    return (
        <div className="flex items-center gap-2 text-white">
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs opacity-90">
                <span className="inline-flex items-center justify-center rounded-full bg-black/40 p-1">
                    {icon}
                </span>
                <span>{label}:</span>
            </span>

            <span className="text-xs sm:text-sm font-medium truncate max-w-[140px] sm:max-w-[180px]">
                {displayValue}
            </span>
        </div>
    );
}
