import React from "react";
import type { Lot } from "@/types/lots";
import { SafeHtml } from "@/components/common/safe-html";

type Props = {
    lot: Lot;
};

export const LotMainInfo: React.FC<Props> = ({ lot }) => {
    return (
        <div className="space-y-6">
            {lot.description && (
                <section className="rounded-xl border bg-card p-4 md:p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                        Description
                    </h2>
                    
                    <div className="text-muted-foreground">
                         <SafeHtml content={lot.description} />
                    </div>
                </section>
            )}
        </div>
    );
};