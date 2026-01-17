import React from "react";
import type { Lot } from "@/types/lots";
import { Badge } from "@/components/ui/badge";
import { LotSpecsGrid, SpecItem } from "@/components/lots/lot-specs";

type Props = {
    lot: Lot;
};

export const LotMainInfo: React.FC<Props> = ({ lot }) => {
    return (
        <>
            {lot.description && (
                <section className="rounded-xl border p-4 md:p-5">
                    <h2 className="mb-2 text-lg font-medium">Description</h2>
                    <p className="whitespace-pre-line text-muted-foreground">
                        {lot.description}
                    </p>
                </section>
            )}
        </>
    );
};
